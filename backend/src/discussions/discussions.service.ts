import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateThreadDto } from './dto/create-thread.dto';
import { CreateAnswerDto } from './dto/create-answer.dto';
import { ThreadQueryDto } from './dto/thread-query.dto';

@Injectable()
export class DiscussionsService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: ThreadQueryDto, userId?: string) {
    const { search, category, sort = 'newest', page = 1, limit = 12 } = query;

    const where: any = {};

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { body: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (category) {
      where.category = { equals: category, mode: 'insensitive' };
    }

    const orderBy = sort === 'votes'
      ? { upvotes: 'desc' as const }
      : { createdAt: 'desc' as const };

    const skip = (page - 1) * limit;

    const [threads, total] = await Promise.all([
      this.prisma.thread.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          author: { select: { id: true, name: true } },
          college: { select: { id: true, name: true, slug: true } },
          _count: { select: { answers: true } },
          votes: userId ? { where: { userId } } : false,
        },
      }),
      this.prisma.thread.count({ where }),
    ]);

    const data = threads.map((thread) => {
      const { votes, ...rest } = thread as any;
      return {
        ...rest,
        hasVoted: votes ? votes.length > 0 : false,
      };
    });

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1,
      },
    };
  }

  async findById(id: string, userId?: string) {
    const thread = await this.prisma.thread.findUnique({
      where: { id },
      include: {
        author: { select: { id: true, name: true } },
        college: { select: { id: true, name: true, slug: true } },
        _count: { select: { answers: true } },
        votes: userId ? { where: { userId } } : false,
        answers: {
          orderBy: [
            { isAccepted: 'desc' },
            { upvotes: 'desc' },
            { createdAt: 'asc' },
          ],
          include: {
            author: { select: { id: true, name: true } },
            votes: userId ? { where: { userId } } : false,
          },
        },
      },
    });

    if (!thread) throw new NotFoundException('Thread not found');

    // Increment view count
    await this.prisma.thread.update({
      where: { id },
      data: { views: { increment: 1 } },
    });

    const { votes, answers, ...rest } = thread as any;

    return {
      ...rest,
      hasVoted: votes ? votes.length > 0 : false,
      answers: answers.map((answer: any) => {
        const { votes: answerVotes, ...answerRest } = answer;
        return {
          ...answerRest,
          hasVoted: answerVotes ? answerVotes.length > 0 : false,
        };
      }),
    };
  }

  async createThread(dto: CreateThreadDto, authorId: string) {
    return this.prisma.thread.create({
      data: {
        title: dto.title,
        body: dto.body,
        category: dto.category,
        collegeId: dto.collegeId || null,
        authorId,
      },
      include: {
        author: { select: { id: true, name: true } },
        college: { select: { id: true, name: true, slug: true } },
        _count: { select: { answers: true } },
      },
    });
  }

  async createAnswer(threadId: string, dto: CreateAnswerDto, authorId: string) {
    const thread = await this.prisma.thread.findUnique({ where: { id: threadId } });
    if (!thread) throw new NotFoundException('Thread not found');

    return this.prisma.answer.create({
      data: {
        body: dto.body,
        threadId,
        authorId,
      },
      include: {
        author: { select: { id: true, name: true } },
      },
    });
  }

  async voteThread(threadId: string, userId: string) {
    const thread = await this.prisma.thread.findUnique({ where: { id: threadId } });
    if (!thread) throw new NotFoundException('Thread not found');

    const existingVote = await this.prisma.threadVote.findUnique({
      where: { threadId_userId: { threadId, userId } },
    });

    if (existingVote) {
      // Remove vote (toggle off)
      await this.prisma.threadVote.delete({
        where: { threadId_userId: { threadId, userId } },
      });
      await this.prisma.thread.update({
        where: { id: threadId },
        data: { upvotes: { decrement: 1 } },
      });
      return { voted: false, upvotes: thread.upvotes - 1 };
    } else {
      // Add vote
      await this.prisma.threadVote.create({
        data: { threadId, userId, value: 1 },
      });
      await this.prisma.thread.update({
        where: { id: threadId },
        data: { upvotes: { increment: 1 } },
      });
      return { voted: true, upvotes: thread.upvotes + 1 };
    }
  }

  async voteAnswer(answerId: string, userId: string) {
    const answer = await this.prisma.answer.findUnique({ where: { id: answerId } });
    if (!answer) throw new NotFoundException('Answer not found');

    const existingVote = await this.prisma.answerVote.findUnique({
      where: { answerId_userId: { answerId, userId } },
    });

    if (existingVote) {
      await this.prisma.answerVote.delete({
        where: { answerId_userId: { answerId, userId } },
      });
      await this.prisma.answer.update({
        where: { id: answerId },
        data: { upvotes: { decrement: 1 } },
      });
      return { voted: false, upvotes: answer.upvotes - 1 };
    } else {
      await this.prisma.answerVote.create({
        data: { answerId, userId, value: 1 },
      });
      await this.prisma.answer.update({
        where: { id: answerId },
        data: { upvotes: { increment: 1 } },
      });
      return { voted: true, upvotes: answer.upvotes + 1 };
    }
  }

  async acceptAnswer(answerId: string, userId: string) {
    const answer = await this.prisma.answer.findUnique({
      where: { id: answerId },
      include: { thread: { select: { authorId: true } } },
    });

    if (!answer) throw new NotFoundException('Answer not found');
    if (answer.thread.authorId !== userId) {
      throw new ForbiddenException('Only the thread author can accept an answer');
    }

    // Unaccept all other answers for this thread
    await this.prisma.answer.updateMany({
      where: { threadId: answer.threadId, isAccepted: true },
      data: { isAccepted: false },
    });

    // Accept this answer
    const updated = await this.prisma.answer.update({
      where: { id: answerId },
      data: { isAccepted: !answer.isAccepted },
      include: {
        author: { select: { id: true, name: true } },
      },
    });

    return updated;
  }
}

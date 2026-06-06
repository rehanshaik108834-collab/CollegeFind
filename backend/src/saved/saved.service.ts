import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SavedService {
  constructor(private prisma: PrismaService) {}

  async getSaved(userId: string) {
    const saved = await this.prisma.savedCollege.findMany({
      where: { userId },
      include: {
        college: {
          include: { _count: { select: { savedBy: true } } },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    return saved.map((s) => s.college);
  }

  async save(userId: string, collegeId: string) {
    const college = await this.prisma.college.findUnique({ where: { id: collegeId } });
    if (!college) throw new NotFoundException('College not found');

    try {
      await this.prisma.savedCollege.create({ data: { userId, collegeId } });
      return { saved: true, message: 'College saved successfully' };
    } catch {
      throw new ConflictException('College already saved');
    }
  }

  async unsave(userId: string, collegeId: string) {
    const record = await this.prisma.savedCollege.findUnique({
      where: { userId_collegeId: { userId, collegeId } },
    });
    if (!record) throw new NotFoundException('Saved record not found');
    await this.prisma.savedCollege.delete({ where: { userId_collegeId: { userId, collegeId } } });
    return { saved: false, message: 'College removed from saved' };
  }

  async getSavedIds(userId: string) {
    const saved = await this.prisma.savedCollege.findMany({
      where: { userId },
      select: { collegeId: true },
    });
    return saved.map((s) => s.collegeId);
  }
}

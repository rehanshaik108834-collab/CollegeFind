import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CollegeQueryDto } from './dto/college-query.dto';

@Injectable()
export class CollegesService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: CollegeQueryDto) {
    const {
      search, state, type, minFees, maxFees, minRating,
      sortBy = 'rating', sortOrder = 'desc',
      page = 1, limit = 12,
    } = query;

    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { location: { contains: search, mode: 'insensitive' } },
        { city: { contains: search, mode: 'insensitive' } },
        { state: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (state) where.state = { equals: state, mode: 'insensitive' };
    if (type) where.type = { equals: type, mode: 'insensitive' };
    if (minFees !== undefined || maxFees !== undefined) {
      where.fees = {};
      if (minFees !== undefined) where.fees.gte = Number(minFees);
      if (maxFees !== undefined) where.fees.lte = Number(maxFees);
    }
    if (minRating !== undefined) where.rating = { gte: Number(minRating) };

    const validSortFields = ['rating', 'fees', 'established', 'name'];
    const orderByField = validSortFields.includes(sortBy) ? sortBy : 'rating';
    const orderBy = { [orderByField]: sortOrder };

    const skip = (page - 1) * limit;

    const [colleges, total] = await Promise.all([
      this.prisma.college.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          courses: true,
          _count: { select: { savedBy: true, reviews: true } },
        },
      }),
      this.prisma.college.count({ where }),
    ]);

    return {
      data: colleges,
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

  async findBySlug(slug: string) {
    const college = await this.prisma.college.findUnique({
      where: { slug },
      include: {
        courses: true,
        reviews: { orderBy: { createdAt: 'desc' }, take: 10 },
        _count: { select: { savedBy: true } },
      },
    });

    if (!college) throw new NotFoundException(`College not found: ${slug}`);
    return college;
  }

  async getFilters() {
    const [states, types] = await Promise.all([
      this.prisma.college.findMany({
        select: { state: true },
        distinct: ['state'],
        orderBy: { state: 'asc' },
      }),
      this.prisma.college.findMany({
        select: { type: true },
        distinct: ['type'],
        orderBy: { type: 'asc' },
      }),
    ]);

    const feesAgg = await this.prisma.college.aggregate({
      _min: { fees: true },
      _max: { fees: true },
    });

    return {
      states: states.map((s) => s.state),
      types: types.map((t) => t.type),
      feesRange: { min: feesAgg._min.fees, max: feesAgg._max.fees },
    };
  }

  async getFeatured() {
    return this.prisma.college.findMany({
      where: { rating: { gte: 4.5 } },
      orderBy: { rating: 'desc' },
      take: 6,
      include: { _count: { select: { savedBy: true } } },
    });
  }
}

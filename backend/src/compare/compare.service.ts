import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CompareService {
  constructor(private prisma: PrismaService) {}

  async compare(ids: string[]) {
    if (!ids || ids.length < 2) throw new BadRequestException('Provide at least 2 college IDs');
    if (ids.length > 3) throw new BadRequestException('Cannot compare more than 3 colleges');

    const colleges = await this.prisma.college.findMany({
      where: { id: { in: ids } },
      include: { courses: true, _count: { select: { savedBy: true } } },
    });

    if (colleges.length < 2) throw new BadRequestException('One or more colleges not found');

    return colleges.sort((a, b) => ids.indexOf(a.id) - ids.indexOf(b.id));
  }
}

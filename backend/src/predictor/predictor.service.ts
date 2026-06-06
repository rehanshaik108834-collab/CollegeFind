import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PredictQueryDto } from './dto/predict-query.dto';

@Injectable()
export class PredictorService {
  constructor(private prisma: PrismaService) {}

  async predict(query: PredictQueryDto) {
    const { exam, rank, category } = query;

    // Find all cutoffs where the student's rank falls within range
    const cutoffs = await this.prisma.predictorCutoff.findMany({
      where: {
        exam: { equals: exam, mode: 'insensitive' },
        category: { equals: category, mode: 'insensitive' },
        closingRank: { gte: rank },
      },
      include: {
        college: {
          include: {
            _count: { select: { savedBy: true } },
          },
        },
      },
    });

    // Score each result by how comfortably the rank falls inside the range
    const results = cutoffs.map((cutoff) => {
      const range = cutoff.closingRank - cutoff.openingRank;
      const position = cutoff.closingRank - rank;
      const score = range > 0 ? position / range : rank <= cutoff.openingRank ? 1 : 0;
      const clampedScore = Math.max(0, Math.min(1, score));

      let matchLevel: 'Excellent' | 'Good' | 'Possible';
      if (clampedScore >= 0.6) {
        matchLevel = 'Excellent';
      } else if (clampedScore >= 0.3) {
        matchLevel = 'Good';
      } else {
        matchLevel = 'Possible';
      }

      return {
        college: cutoff.college,
        matchLevel,
        score: Math.round(clampedScore * 100) / 100,
        openingRank: cutoff.openingRank,
        closingRank: cutoff.closingRank,
        exam: cutoff.exam,
        category: cutoff.category,
        year: cutoff.year,
      };
    });

    // Sort by score descending (best matches first)
    results.sort((a, b) => b.score - a.score);

    return results;
  }
}

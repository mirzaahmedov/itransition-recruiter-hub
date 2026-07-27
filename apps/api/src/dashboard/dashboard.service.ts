import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { PositionStatus, ResumeStatus, UserRole } from '@rh/database/client';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getStats() {
    const [resume, activePosition, candidate] = await Promise.all([
      this.prisma.resume.count({
        where: {
          status: {
            in: [ResumeStatus.PRIVATE, ResumeStatus.PUBLISHED],
          },
        },
      }),
      this.prisma.position.count({
        where: {
          status: {
            in: [PositionStatus.ACTIVE],
          },
        },
      }),
      this.prisma.user.count({
        where: {
          role: UserRole.CANDIDATE,
        },
      }),
    ]);

    return {
      resume,
      activePosition,
      candidate,
    };
  }

  async getLatestPositions() {
    return await this.prisma.position.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      where: {
        status: PositionStatus.ACTIVE,
      },
    });
  }
  async getPopularPositions() {
    return this.prisma.position.findMany({
      orderBy: {
        resumes: { _count: 'desc' },
      },
      where: {
        status: PositionStatus.ACTIVE,
      },
    });
  }
}

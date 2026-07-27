import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { ResumeStatus } from '@rh/database/client';

@Injectable()
export class ResumeLikeService {
  constructor(private prisma: PrismaService) {}

  async create({ resumeId, userId }: { resumeId: string; userId: string }) {
    return this.prisma.resumeLike.create({
      data: {
        resumeId,
        userId,
      },
    });
  }

  async findAll(userId: string) {
    return this.prisma.resumeLike.findMany({
      where: {
        userId,
        resume: {
          status: ResumeStatus.PUBLISHED,
        },
      },
      include: {
        user: true,
        resume: {
          include: {
            user: true,
            position: true,
          },
        },
      },
    });
  }

  async findOne({ id, userId }: { id: string; userId: string }) {
    return this.prisma.resumeLike.findUnique({
      where: {
        id,
        userId,
      },
    });
  }

  async remove({ resumeId, userId }: { resumeId: string; userId: string }) {
    return this.prisma.resumeLike.delete({
      where: {
        userId_resumeId: {
          resumeId,
          userId,
        },
      },
    });
  }
}

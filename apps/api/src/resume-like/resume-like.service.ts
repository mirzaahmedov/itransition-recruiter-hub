import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';

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
      },
      include: {
        resume: {
          include: {
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

  async remove({ id, userId }: { id: string; userId: string }) {
    return this.prisma.resumeLike.delete({
      where: {
        id,
        userId,
      },
    });
  }
}

import { Injectable } from '@nestjs/common';
import { CreateResumeLikeDto } from './dto/create-resume-like.dto';
import { UpdateResumeLikeDto } from './dto/update-resume-like.dto';
import { PrismaService } from '@/prisma/prisma.service';

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

import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateResumeDto } from './dto/create-resume.dto';
import { PrismaService } from '@/prisma/prisma.service';
import { UserAttributeService } from '@/user/attribute/user-attribute.service';
import { PositionService } from '../position.service';
import type { ResumeStatus } from '@rh/database/client';

const resumeInclude = {
  position: true,
  user: true,
  resumeAttributes: {
    include: {
      positionAttribute: {
        include: {
          attribute: true,
        },
      },
      userAttribute: {
        include: {
          attribute: true,
          choice: true,
        },
      },
    },
  },
} as const;

@Injectable()
export class ResumeService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userAttributeService: UserAttributeService,
    private readonly positionService: PositionService,
  ) {}

  async create(data: CreateResumeDto) {
    const userAttributes = await this.userAttributeService.findByUserId(
      data.userId,
    );
    const positionAttributes = await this.positionService.findOne(
      data.positionId,
    );

    const resume = await this.prisma.resume.create({
      data: {
        positionId: data.positionId,
        userId: data.userId,
        resumeAttributes: {
          create: positionAttributes.attributes.map((pa) => {
            const found = userAttributes.find(
              (ua) => ua.attributeId === pa.attributeId,
            );
            return {
              positionAttribute: {
                connect: {
                  id: pa.id,
                },
              },
              userAttribute: found
                ? {
                    connect: {
                      id: found.id,
                    },
                  }
                : {
                    create: {
                      userId: data.userId,
                      attributeId: pa.attributeId,
                    },
                  },
            };
          }),
        },
      },
    });

    return resume;
  }

  async findAllByPosition(positionId: string) {
    return await this.prisma.resume.findMany({
      where: { positionId },
      include: {
        user: true,
        resumeAttributes: {
          include: {
            userAttribute: {
              include: {
                attribute: true,
                choice: true,
              },
            },
          },
        },
      },
    });
  }

  async findAllByUser(userId: string) {
    return await this.prisma.resume.findMany({
      where: { userId },
      include: {
        position: true,
        resumeAttributes: {
          include: {
            positionAttribute: {
              include: {
                attribute: true,
              },
            },
            userAttribute: {
              include: {
                attribute: true,
                choice: true,
              },
            },
          },
        },
      },
    });
  }

  async findOne(id: string) {
    const resume = await this.prisma.resume.findUnique({
      where: { id },
      include: resumeInclude,
    });

    if (!resume) {
      throw new NotFoundException(`Resume #${id} not found`);
    }

    return resume;
  }

  async updateStatus(id: string, status: ResumeStatus) {
    await this.findOne(id);

    return await this.prisma.resume.update({
      where: { id },
      data: { status },
      include: resumeInclude,
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return await this.prisma.resume.delete({
      where: { id },
    });
  }
}

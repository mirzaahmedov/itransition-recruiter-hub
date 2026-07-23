import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CreateResumeDto } from './dto/create-resume.dto';
import { PrismaService } from '@/prisma/prisma.service';
import { UserAttributeService } from '@/user/attribute/user-attribute.service';
import { PositionService } from '../position.service';
import type { ResumeStatus, User } from '@rh/database/client';
import { UserRole } from '@rh/database/enums';

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

  async findAllByPosition(positionId: string, user?: User) {
    const where: Record<string, unknown> = { positionId };

    if (user && user.role === UserRole.CANDIDATE) {
      where.userId = user.id;
    } else if (user) {
      where.status = 'PUBLISHED';
    }

    return await this.prisma.resume.findMany({
      where,
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

  async findOneByUserAndPosition(userId: string, positionId: string) {
    return await this.prisma.resume.findUnique({
      where: {
        userId_positionId: {
          userId,
          positionId,
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

  async publish(id: string, userId: string) {
    const resume = await this.findOne(id);

    if (resume.userId !== userId) {
      throw new NotFoundException(`Resume #${id} not found`);
    }

    if (resume.status === 'PUBLISHED') {
      return resume;
    }

    const emptyAttrs = resume.resumeAttributes.filter((ra) => {
      const ua = ra.userAttribute;
      return (
        ua.textValue == null &&
        ua.numberValue == null &&
        ua.booleanValue == null &&
        ua.dateValue == null &&
        ua.startDateValue == null &&
        ua.endDateValue == null &&
        ua.choiceId == null
      );
    });

    if (emptyAttrs.length > 0) {
      const names = emptyAttrs.map((ra) => ra.positionAttribute.attribute.name);
      throw new BadRequestException(
        `Cannot publish: the following attributes are empty: ${names.join(', ')}`,
      );
    }

    return await this.prisma.resume.update({
      where: { id },
      data: { status: 'PUBLISHED' },
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

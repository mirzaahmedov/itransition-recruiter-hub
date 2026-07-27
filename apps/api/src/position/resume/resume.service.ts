import { PrismaService } from '@/prisma/prisma.service';
import { UserAttributeService } from '@/user/attribute/user-attribute.service';
import { ProjectService } from '@/user/project/project.service';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ResumeAttribute } from '@rh/database/browser';
import { ResumeStatus, User } from '@rh/database/client';
import { UserRole } from '@rh/database/enums';
import { ResumeFindUniqueArgs } from '@rh/database/models';
import { isDynamicValueFilled } from '@rh/shared';
import { PositionService } from '../position.service';
import { CreateResumeDto } from './resume.dto';

const resumeDetailInclude = {
  position: true,
  user: true,
  attributes: {
    include: {
      positionAttribute: {
        include: {
          attribute: true,
        },
      },
      userAttribute: {
        include: {
          attribute: {
            include: {
              choices: true,
            },
          },
          choice: true,
        },
      },
    },
  },
  projects: {
    include: {
      project: true,
    },
  },
} as const satisfies ResumeFindUniqueArgs['include'];

@Injectable()
export class ResumeService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userAttributeService: UserAttributeService,
    private readonly positionService: PositionService,
    private readonly projectService: ProjectService,
  ) {}

  async create(data: CreateResumeDto) {
    const userAttributes = await this.userAttributeService.findByUserId(
      data.userId,
    );
    const positionAttributes = await this.positionService.findOne({
      id: data.positionId,
    });
    const userProjects = await this.projectService.findByUserId(data.userId);

    const resume = await this.prisma.resume.create({
      data: {
        positionId: data.positionId,
        userId: data.userId,
        attributes: {
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
        projects: {
          create: userProjects.slice(0, 3).map((r) => ({
            projectId: r.id,
          })),
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
      where.status = ResumeStatus.PUBLISHED;
    }

    return await this.prisma.resume.findMany({
      where,
      include: {
        user: true,
        attributes: {
          include: {
            userAttribute: {
              include: {
                attribute: true,
                choice: true,
              },
            },
          },
        },
        likes: user
          ? {
              where: {
                userId: user.id,
              },
            }
          : false,
      },
    });
  }

  async findAllByUser(userId: string) {
    return await this.prisma.resume.findMany({
      where: { userId },
      include: {
        position: true,
        user: true,
        attributes: {
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

  async findAllPublished() {
    return await this.prisma.resume.findMany({
      include: {
        position: true,
        user: true,
        attributes: {
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

  async findOne(id: string, user?: User) {
    const resume = await this.prisma.resume.findUnique({
      where: { id },
      include: {
        ...resumeDetailInclude,
        likes:
          user && user.role === UserRole.RECRUITER
            ? {
                where: {
                  userId: user.id,
                },
              }
            : false,
      },
    });

    if (!resume) {
      throw new NotFoundException(`Resume #${id} not found`);
    }

    return resume;
  }

  async findProjects(resumeId: string) {
    return this.prisma.resumeProject.findMany({
      where: {
        resumeId,
      },
    });
  }

  async updateStatus(id: string, status: ResumeStatus) {
    await this.findOne(id);

    return await this.prisma.resume.update({
      where: { id },
      data: { status },
      include: resumeDetailInclude,
    });
  }

  async publish(id: string, userId: string) {
    const resume = await this.findOne(id);

    if (resume.userId !== userId) {
      throw new ForbiddenException();
    }

    if (resume.status === ResumeStatus.PUBLISHED) {
      return resume;
    }

    const emptyAttributes = resume.attributes.filter(
      (attribute) =>
        !isDynamicValueFilled(
          attribute.userAttribute,
          attribute.positionAttribute.attribute.type,
        ),
    );

    if (emptyAttributes.length > 0) {
      const names = emptyAttributes.map(
        (ra) => ra.positionAttribute.attribute.name,
      );
      throw new BadRequestException(
        `Cannot publish: the following attributes are empty: ${names.join(', ')}`,
      );
    }

    return await this.prisma.resume.update({
      where: { id },
      data: { status: ResumeStatus.PUBLISHED },
      include: resumeDetailInclude,
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return await this.prisma.resume.delete({
      where: { id },
    });
  }

  async bulkAddAttributes(data: Omit<ResumeAttribute, 'id'>[]) {
    await this.prisma.resumeAttribute.createMany({
      data,
      skipDuplicates: true,
    });
  }
}

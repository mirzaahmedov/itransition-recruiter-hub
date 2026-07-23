import { PrismaService } from '@/prisma/prisma.service';
import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePositionPayload, UpdatePositionPayload } from '@rh/shared';
import { ResumeService } from './resume/resume.service';
import { UserAttributeService } from '@/user/attribute/user-attribute.service';
import { PositionStatus } from '@rh/database/client';

const positionInclude = {
  attributes: {
    include: {
      attribute: true,
    },
  },
} as const;

interface PositionFindOneArgs {
  id: string;
  userId?: string;
}
interface PositionFindAllArgs {
  search: string;
}

@Injectable()
export class PositionService {
  constructor(
    readonly prisma: PrismaService,
    @Inject(forwardRef(() => ResumeService))
    readonly resumeService: ResumeService,
    readonly userAttributeService: UserAttributeService,
  ) {}

  async create(payload: CreatePositionPayload) {
    return await this.prisma.position.create({
      data: {
        title: payload.title,
        description: payload.description,
        attributes: {
          create: payload.attributes.map((attr) => ({
            attributeId: attr.id,
          })),
        },
      },
      include: positionInclude,
    });
  }

  async findAll({ search }: PositionFindAllArgs) {
    return await this.prisma.position.findMany({
      include: positionInclude,
      where: {
        OR: [
          {
            title: {
              contains: search,
              mode: 'insensitive',
            },
            description: {
              contains: search,
              mode: 'insensitive',
            },
          },
        ],
      },
    });
  }

  async findOne({ id, userId }: PositionFindOneArgs) {
    const position = await this.prisma.position.findUnique({
      where: {
        id,
      },
      include: {
        ...positionInclude,
        resumes: userId
          ? {
              where: {
                userId,
              },
            }
          : undefined,
      },
    });

    if (!position) {
      throw new NotFoundException(`Position #${id} not found`);
    }

    return position;
  }

  async update(id: string, data: UpdatePositionPayload) {
    await this.findOne({ id });

    return await this.prisma.position.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
      },
      include: positionInclude,
    });
  }

  async updateStatus(id: string, status: PositionStatus) {
    await this.findOne({ id });

    return await this.prisma.position.update({
      where: { id },
      data: {
        status,
      },
      include: positionInclude,
    });
  }

  async bulkAddAttributes(positionId: string, ids: string[]) {
    await this.findOne({ id: positionId });

    const positionAttributes =
      await this.prisma.positionAttribute.createManyAndReturn({
        data: ids.map((id) => ({
          positionId,
          attributeId: id,
        })),
        skipDuplicates: true,
      });

    const resumes = await this.resumeService.findAllByPosition(positionId);

    await this.prisma.userAttribute.createManyAndReturn({
      data: resumes.flatMap((resume) => {
        return positionAttributes.map((attribute) => ({
          userId: resume.userId,
          attributeId: attribute.attributeId,
        }));
      }),
      skipDuplicates: true,
    });

    const userAttributes = await this.prisma.userAttribute.findMany({
      where: {
        userId: {
          in: resumes.map((r) => r.userId),
        },
        attributeId: {
          in: positionAttributes.map((r) => r.attributeId),
        },
      },
    });

    await this.prisma.resumeAttribute.createMany({
      data: userAttributes.map((userAttribute) => ({
        userAttributeId: userAttribute.id,
        positionAttributeId: positionAttributes.find(
          (pa) => pa.attributeId === userAttribute.attributeId,
        )!.id,
        resumeId: resumes.find((r) => r.userId === userAttribute.userId)!.id,
      })),
    });
  }

  async removeAttribute(positionId: string, attributeId: string) {
    await this.findOne({ id: positionId });

    const positionAttribute = await this.prisma.positionAttribute.findFirst({
      where: {
        positionId,
        attributeId,
      },
    });

    if (!positionAttribute) {
      throw new NotFoundException(
        `Attribute #${attributeId} not found on position #${positionId}`,
      );
    }

    await this.prisma.positionAttribute.delete({
      where: { id: positionAttribute.id },
    });

    return this.findOne({ id: positionId });
  }

  async delete(id: string) {
    await this.findOne({ id });

    return await this.prisma.position.delete({
      where: { id },
    });
  }
}

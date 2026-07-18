import { PrismaService } from '@/prisma/prisma.service';
import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { CreatePositionPayload, UpdatePositionPayload } from '@rh/shared';

const positionInclude = {
  attributes: {
    include: {
      attribute: true,
    },
  },
} as const;

@Injectable()
export class PositionService {
  constructor(readonly prisma: PrismaService) {}

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

  async findAll() {
    return await this.prisma.position.findMany({
      include: positionInclude,
    });
  }

  async findOne(id: string) {
    const position = await this.prisma.position.findUnique({
      where: { id },
      include: positionInclude,
    });

    if (!position) {
      throw new NotFoundException(`Position #${id} not found`);
    }

    return position;
  }

  async update(id: string, payload: UpdatePositionPayload) {
    await this.findOne(id);

    return await this.prisma.position.update({
      where: { id },
      data: {
        ...(payload.title !== undefined && { title: payload.title }),
        ...(payload.description !== undefined && {
          description: payload.description,
        }),
        ...(payload.attributes !== undefined && {
          attributes: {
            deleteMany: {},
            create: payload.attributes.map((attr) => ({
              attributeId: attr.id,
            })),
          },
        }),
      },
      include: positionInclude,
    });
  }

  async addAttribute(positionId: string, attributeId: string) {
    await this.findOne(positionId);

    const existing = await this.prisma.positionAttribute.findFirst({
      where: {
        positionId,
        attributeId,
      },
    });

    if (existing) {
      throw new ConflictException(
        'Attribute is already assigned to this position',
      );
    }

    await this.prisma.positionAttribute.create({
      data: {
        positionId,
        attributeId,
      },
    });

    return this.findOne(positionId);
  }

  async removeAttribute(positionId: string, attributeId: string) {
    await this.findOne(positionId);

    const positionAttribute =
      await this.prisma.positionAttribute.findFirst({
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

    return this.findOne(positionId);
  }

  async delete(id: string) {
    await this.findOne(id);

    return await this.prisma.position.delete({
      where: { id },
    });
  }
}

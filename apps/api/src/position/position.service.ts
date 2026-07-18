import { PrismaService } from '@/prisma/prisma.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePositionPayload, UpdatePositionPayload } from '@rh/shared';

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
    });
  }

  async findAll() {
    return await this.prisma.position.findMany({
      include: {
        attributes: true,
      },
    });
  }

  async findOne(id: string) {
    const position = await this.prisma.position.findUnique({
      where: { id },
      include: { attributes: true },
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
      include: { attributes: true },
    });
  }

  async delete(id: string) {
    await this.findOne(id);

    return await this.prisma.position.delete({
      where: { id },
    });
  }
}

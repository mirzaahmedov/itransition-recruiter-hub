import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { AttributeUpdateInput } from '@rh/database/models';
import { AttributeCreatePayload } from '@rh/shared';

@Injectable()
export class AttributeService {
  constructor(private prisma: PrismaService) {}

  async create(payload: AttributeCreatePayload) {
    return await this.prisma.attribute.create({
      data: {
        name: payload.name,
        type: payload.type,
        category: {
          connect: {
            id: payload.categoryId,
          },
        },
        choices: {
          create: payload.choices,
        },
      },
    });
  }

  async rename(id: string, name: string) {
    return await this.prisma.attribute.update({
      data: {
        name,
      },
      where: {
        id,
      },
    });
  }

  async findAll(categoryId: string) {
    return await this.prisma.attribute.findMany({
      where: {
        categoryId,
      },
      include: {
        choices: true,
        category: true,
      },
    });
  }

  async search(search: string) {
    return await this.prisma.category.findMany({
      include: {
        attrs: {
          where: {
            name: {
              contains: search,
              mode: 'insensitive',
            },
          },
        },
      },
    });
  }

  async findOne(id: string) {
    return await this.prisma.attribute.findFirst({
      where: {
        id,
      },
    });
  }

  async update(id: string, payload: AttributeUpdateInput) {
    return await this.prisma.attribute.update({
      where: { id },
      data: payload,
    });
  }

  async remove(id: string) {
    return await this.prisma.attribute.delete({
      where: { id },
    });
  }
}

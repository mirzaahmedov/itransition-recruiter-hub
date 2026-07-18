import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateAttributePayload } from '@rh/shared';

@Injectable()
export class AttributeService {
  constructor(private prisma: PrismaService) {}

  async create(payload: CreateAttributePayload) {
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

  async update(id: string, name: string) {
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

  async search(query: string, categoryId?: string) {
    return this.prisma.attribute.findMany({
      where: {
        name: {
          contains: query,
          mode: 'insensitive',
        },
        categoryId: categoryId || undefined,
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

  async delete(id: string) {
    return await this.prisma.attribute.delete({
      where: { id },
    });
  }
}

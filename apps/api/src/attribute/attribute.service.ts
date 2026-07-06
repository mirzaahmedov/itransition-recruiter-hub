import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import {
  AttributeCreateInput,
  AttributeUpdateInput,
} from '@rh/database/models';

@Injectable()
export class AttributeService {
  constructor(private prisma: PrismaService) {}

  async create(payload: AttributeCreateInput) {
    return await this.prisma.attribute.create({
      data: payload,
    });
  }

  async findAll(categoryId: string) {
    return await this.prisma.attribute.findMany({
      where: {
        categoryId,
      },
      include: {
        choices: true,
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

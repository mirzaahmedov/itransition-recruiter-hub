import {
  AttributeCategoryCreateInput,
  AttributeCategoryUpdateInput,
} from '@rh/database/models';
import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AttributeCategoryService {
  constructor(private prisma: PrismaService) {}

  async getAll() {
    const categories = await this.prisma.attributeCategory.findMany();
    return categories;
  }

  async getAllNestedChilds() {
    const categories = await this.prisma.attributeCategory.findMany({
      include: {
        attributes: true,
      },
    });
    return categories;
  }

  async create(payload: AttributeCategoryCreateInput) {
    const category = await this.prisma.attributeCategory.create({
      data: payload,
    });
    return category;
  }

  async update(id: string, payload: AttributeCategoryUpdateInput) {
    const updatedCategory = await this.prisma.attributeCategory.update({
      where: {
        id,
      },
      data: payload,
    });
    return updatedCategory;
  }

  async delete(id: string) {
    const deletedCategory = await this.prisma.attributeCategory.delete({
      where: { id },
    });
    return deletedCategory;
  }
}

import { ATTRIBUTE_CATEGORIES } from '@/data/categories';
import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return await this.prisma.category.findMany();
  }
}

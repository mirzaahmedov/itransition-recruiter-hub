import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateAttributePayload } from '@rh/shared/schemas';

interface AttributeFindManyArgs {
  categoryId?: string;
  pageIndex: number;
  pageSize: number;
  search: string;
}

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

  async findMany({
    categoryId,
    pageIndex,
    pageSize,
    search,
  }: AttributeFindManyArgs) {
    const [attributes, totalCount] = await this.prisma.$transaction([
      this.prisma.attribute.findMany({
        where: {
          categoryId: categoryId || undefined,
          name: {
            contains: search,
            mode: 'insensitive',
          },
        },
        skip: (pageIndex - 1) * pageSize,
        take: pageSize,
        include: {
          choices: true,
          category: true,
          _count: {
            select: {
              values: true,
              positionAttributes: true,
            },
          },
        },
      }),
      this.prisma.attribute.count({
        where: {
          categoryId: categoryId || undefined,
          name: {
            contains: search,
            mode: 'insensitive',
          },
        },
      }),
    ]);

    return {
      attributes,
      totalCount,
    };
  }

  async isUsed(id: string) {
    const counts = await this.prisma.attribute.findUnique({
      where: { id },
      select: {
        _count: {
          select: {
            values: true,
            positionAttributes: true,
          },
        },
      },
    });

    if (!counts) return false;

    return counts._count.values > 0 || counts._count.positionAttributes > 0;
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

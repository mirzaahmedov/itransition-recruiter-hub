import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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
      include: {
        choices: {
          include: {
            _count: {
              select: { values: true },
            },
          },
        },
        category: true,
        _count: {
          select: {
            values: true,
            positionAttributes: true,
          },
        },
      },
    });
  }

  async delete(id: string) {
    return await this.prisma.attribute.delete({
      where: { id },
    });
  }

  async bulkDelete(attrIds: string[]): Promise<{ deleted: number }> {
    const unused = await this.prisma.attribute.findMany({
      where: {
        values: {
          none: {},
        },
        positionAttributes: {
          none: {},
        },
        id: {
          in: attrIds,
        },
      },
    });

    const idsToDelete = unused.map(({ id }) => id);

    if (idsToDelete.length === 0) {
      return { deleted: 0 };
    }

    const result = await this.prisma.attribute.deleteMany({
      where: {
        id: {
          in: idsToDelete,
        },
      },
    });

    return {
      deleted: result.count,
    };
  }

  async addChoice(attributeId: string, value: string) {
    const attribute = await this.prisma.attribute.findUnique({
      where: { id: attributeId },
      select: { id: true },
    });

    if (!attribute) {
      throw new NotFoundException('Attribute not found');
    }

    return this.prisma.attributeChoice.create({
      data: {
        value,
        attributeId,
      },
    });
  }

  async renameChoice(attributeId: string, choiceId: string, value: string) {
    const choice = await this.prisma.attributeChoice.findFirst({
      where: {
        id: choiceId,
        attributeId,
      },
      include: {
        _count: {
          select: { values: true },
        },
      },
    });

    if (!choice) {
      throw new NotFoundException('Choice not found');
    }

    if (choice._count.values > 0) {
      throw new BadRequestException('Cannot rename a choice that is in use');
    }

    return this.prisma.attributeChoice.update({
      where: { id: choiceId },
      data: { value },
    });
  }

  async removeChoice(attributeId: string, choiceId: string) {
    const choice = await this.prisma.attributeChoice.findFirst({
      where: {
        id: choiceId,
        attributeId,
      },
      include: {
        _count: {
          select: { values: true },
        },
      },
    });

    if (!choice) {
      throw new NotFoundException('Choice not found');
    }

    if (choice._count.values > 0) {
      throw new BadRequestException('Cannot delete a choice that is in use');
    }

    return this.prisma.attributeChoice.delete({
      where: { id: choiceId },
    });
  }
}

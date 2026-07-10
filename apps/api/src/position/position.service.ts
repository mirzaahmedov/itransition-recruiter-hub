import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { PositionCreatePayload } from '@rh/shared';

@Injectable()
export class PositionService {
  constructor(readonly prisma: PrismaService) {}

  async create(payload: PositionCreatePayload) {
    const position = this.prisma.position.create({
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
    return position;
  }

  async findAll() {
    return await this.prisma.position.findMany({
      include: {
        attributes: true,
      },
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} position`;
  }

  update(id: number, payload: unknown) {
    console.log({ payload });
    return `This action updates a #${id} position`;
  }

  remove(id: number) {
    return `This action removes a #${id} position`;
  }
}

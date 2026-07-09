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
          connect: payload.attributes.map(({ id }) => ({
            id,
          })),
        },
      },
    });
    return position;
  }

  findAll() {
    return `This action returns all position`;
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

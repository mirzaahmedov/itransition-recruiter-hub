import { PrismaService } from '@/prisma/prisma.service';
import { ConflictException, Injectable } from '@nestjs/common';
import {
  ProfileAttributeCreatePayload,
  ProfileAttributeUpdatePayload,
} from '@rh/shared';
import { ProfileAttributeCreateBulkDto } from './user-attribute.dto';

interface IdParams {
  userId: string;
  version: number;
  id: string;
}

@Injectable()
export class UserAttributeService {
  constructor(private prisma: PrismaService) {}

  async create(data: ProfileAttributeCreatePayload & Pick<IdParams, 'userId'>) {
    return await this.prisma.userAttribute.create({
      data: {
        attributeId: data.attrId,
        userId: data.userId,
      },
    });
  }
  async createBulk(
    data: ProfileAttributeCreateBulkDto & Pick<IdParams, 'userId'>,
  ): Promise<any> {
    return await this.prisma.userAttribute.createMany({
      data: data.ids.map((id) => ({
        attributeId: id,
        userId: data.userId,
      })),
      skipDuplicates: true,
    });
  }

  async update(
    { id, userId, version }: IdParams,
    data: ProfileAttributeUpdatePayload,
  ) {
    return await this.prisma.$transaction(async (tx) => {
      const result = await tx.userAttribute.updateMany({
        data: {
          ...data,
          version: {
            increment: 1,
          },
        },
        where: {
          id,
          userId,
          version,
        },
      });

      if (result.count === 0) {
        throw new ConflictException('Concurrent modification detected.');
      }
    });
  }

  async findUserAttributes(userId: string) {
    return await this.prisma.userAttribute.findMany({
      where: {
        userId,
      },
      include: {
        choice: true,
        attribute: true,
      },
    });
  }

  async findById(userId: string, id: string) {
    return await this.prisma.userAttribute.findUnique({
      where: {
        userId,
        id,
      },
      include: {
        attribute: true,
      },
    });
  }
}

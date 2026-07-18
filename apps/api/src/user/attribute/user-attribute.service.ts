import { PrismaService } from '@/prisma/prisma.service';
import { ConflictException, Injectable } from '@nestjs/common';
import {
  CreateUserProfileAttributePayload,
  UpdateUserProfileAttributePayload,
} from '@rh/shared/schemas';
import { BulkCreateUserProfileAttributeDto } from './user-attribute.dto';
import { BulkUpdateUserProfileAttributePayload } from '@rh/shared/schemas';
import { makeResponse } from '@/models/api';
import { UserAttribute } from '@rh/database/client';

interface IdParams {
  userId: string;
  version: number;
  id: string;
}

@Injectable()
export class UserAttributeService {
  constructor(private prisma: PrismaService) {}

  async create(
    data: CreateUserProfileAttributePayload & Pick<IdParams, 'userId'>,
  ) {
    return await this.prisma.userAttribute.create({
      data: {
        attributeId: data.attrId,
        userId: data.userId,
      },
    });
  }
  async bulkCreate(
    data: BulkCreateUserProfileAttributeDto & Pick<IdParams, 'userId'>,
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
    data: UpdateUserProfileAttributePayload,
  ) {
    return await this.prisma.$transaction(async (tx) => {
      const results = await tx.userAttribute.updateManyAndReturn({
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

      if (results.length === 0) {
        throw new ConflictException('Concurrent modification detected.');
      }

      return results[0];
    });
  }

  async bulkUpdate(
    { userId }: Pick<IdParams, 'userId'>,
    data: BulkUpdateUserProfileAttributePayload,
  ) {
    const results = await Promise.allSettled(
      data.map((item) =>
        this.prisma.$transaction(async (tx) => {
          const results = await tx.userAttribute.updateManyAndReturn({
            data: {
              ...item.data,
              version: {
                increment: 1,
              },
            },
            where: {
              id: item.id,
              version: item.version,
              userId,
            },
          });

          if (results.length === 0) {
            throw new ConflictException('Concurrent modification detected.');
          }

          return results[0];
        }),
      ),
    );

    const concurrent_modification: BulkUpdateUserProfileAttributePayload = [];
    const failed_unknown: BulkUpdateUserProfileAttributePayload = [];
    const modified: UserAttribute[] = [];

    results.forEach((result, index) => {
      if (
        result.status === 'rejected' &&
        result.reason instanceof ConflictException
      ) {
        concurrent_modification.push(data[index]);
      } else if (result.status === 'rejected') {
        failed_unknown.push(data[index]);
      } else {
        modified.push(result.value);
      }
    });

    return {
      concurrent_modification,
      failed_unknown,
      modified,
    };
  }

  async findByUserId(userId: string) {
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

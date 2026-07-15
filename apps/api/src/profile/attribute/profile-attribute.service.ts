import { PrismaService } from '@/prisma/prisma.service';
import { ConflictException, Injectable } from '@nestjs/common';
import {
  ProfileAttributeCreatePayload,
  ProfileAttributeUpdatePayload,
} from '@rh/shared';

interface IdParams {
  profileId: string;
  version: number;
  id: string;
}

@Injectable()
export class ProfileAttributeService {
  constructor(private prisma: PrismaService) {}

  async create(
    payload: ProfileAttributeCreatePayload & Pick<IdParams, 'profileId'>,
  ) {
    return await this.prisma.profileAttribute.create({
      data: {
        attributeId: payload.attrId,
        profileId: payload.profileId,
      },
    });
  }

  async update(
    { id, profileId, version }: IdParams,
    payload: ProfileAttributeUpdatePayload,
  ) {
    return await this.prisma.$transaction(async (tx) => {
      const result = await tx.profileAttribute.updateMany({
        data: {
          ...payload,
          version: {
            increment: 1,
          },
        },
        where: {
          id,
          profileId,
          version,
        },
      });

      if (result.count === 0) {
        throw new ConflictException('Concurrent modification detected.');
      }
    });
  }

  async findById(id: string) {
    return await this.prisma.profileAttribute.findUnique({
      where: {
        id,
      },
      include: {
        attribute: true,
      },
    });
  }
}

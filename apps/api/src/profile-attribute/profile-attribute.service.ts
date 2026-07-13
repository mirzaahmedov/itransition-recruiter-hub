import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import {
  ProfileAttributeCreatePayload,
  ProfileAttributeUpdatePayload,
} from '@rh/shared';

interface IdParams {
  profileId: string;
  id: string;
}

@Injectable()
export class ProfileAttributeService {
  constructor(private prisma: PrismaService) {}

  async create(
    payload: ProfileAttributeCreatePayload & Pick<IdParams, 'profileId'>,
  ) {
    return await this.prisma.attributeValue.create({
      data: {
        attributeId: payload.attrId,
        profileId: payload.profileId,
      },
    });
  }

  async update(
    { id, profileId }: IdParams,
    payload: ProfileAttributeUpdatePayload,
  ) {
    return await this.prisma.attributeValue.update({
      data: payload,
      where: {
        id,
        profileId,
      },
    });
  }

  async findById(id: string) {
    return await this.prisma.attributeValue.findUnique({
      where: {
        id,
      },
      include: {
        attribute: true,
      },
    });
  }
}

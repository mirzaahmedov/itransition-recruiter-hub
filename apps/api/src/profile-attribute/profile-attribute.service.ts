import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { ProfileAttributeCreatePayload } from '@rh/shared';

@Injectable()
export class ProfileAttributeService {
  constructor(private prisma: PrismaService) {}

  async create(payload: ProfileAttributeCreatePayload & { profileId: string }) {
    return await this.prisma.attributeValue.create({
      data: {
        attributeId: payload.attrId,
        profileId: payload.profileId,
      },
    });
  }
}

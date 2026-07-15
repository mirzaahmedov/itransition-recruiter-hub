import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserProfileService {
  constructor(private prisma: PrismaService) {}

  async findByUserId(userId: string, includeAttributes = false) {
    const profile = await this.prisma.userProfile.findUnique({
      where: {
        userId,
      },
      include: includeAttributes
        ? {
            attrs: {
              include: {
                attribute: true,
              },
            },
          }
        : undefined,
    });
    return profile;
  }
}

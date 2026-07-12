import { UserRole } from '@rh/database/enums';
import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async findMany() {
    const users = await this.prisma.user.findMany();
    return users;
  }

  async findUserProfile(userId: string) {
    const profile = await this.prisma.userProfile.findUnique({
      where: {
        userId,
      },
      include: {
        attrs: {
          include: {
            attribute: true,
          },
        },
      },
    });
    return profile;
  }

  async bulkUpdateRoles(userIds: string[], role: UserRole): Promise<void> {
    await this.prisma.user.updateMany({
      where: {
        id: {
          in: userIds,
        },
      },
      data: {
        role,
      },
    });
  }
}

import { UserRole } from '@rh/database/enums';
import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import {
  UserCreateWithoutProfileInput,
  UserUpdateWithoutProfileInput,
} from '@rh/database/models';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create(data: UserCreateWithoutProfileInput) {
    return this.prisma.user.create({
      data: {
        ...data,
        profile: {
          create: {},
        },
      },
    });
  }

  async update(id: string, data: UserUpdateWithoutProfileInput) {
    return this.prisma.user.update({
      data,
      where: {
        id,
      },
    });
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: {
        email,
      },
    });
  }

  async findById(id: string) {
    return this.prisma.user.findUnique({
      where: {
        id,
      },
    });
  }

  async findMany() {
    const users = await this.prisma.user.findMany();
    return users;
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

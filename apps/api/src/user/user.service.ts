import { ResumeStatus, UserRole } from '@rh/database/enums';
import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { UserCreateInput, UserUpdateInput } from '@rh/database/models';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create(data: UserCreateInput) {
    return this.prisma.user.create({
      data: {
        ...data,
      },
    });
  }

  async update(id: string, data: UserUpdateInput) {
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
  async findCandidates() {
    const users = await this.prisma.user.findMany({
      where: {
        role: UserRole.CANDIDATE,
        resumes: {
          some: {
            status: ResumeStatus.PUBLISHED,
          },
        },
      },
      include: {
        resumes: true,
      },
    });
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

  async bulkDelete(userIds: string[]): Promise<void> {
    await this.prisma.user.deleteMany({
      where: {
        id: {
          in: userIds,
        },
      },
    });
  }
}

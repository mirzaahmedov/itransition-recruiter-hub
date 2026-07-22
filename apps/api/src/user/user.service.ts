import { ResumeStatus, UserRole } from '@rh/database/enums';
import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { UserCreateInput, UserUpdateInput } from '@rh/database/models';

interface UserFindManyArgs {
  search?: string;
  pageIndex: number;
  pageSize: number;
}

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

  async findMany({ search, pageIndex, pageSize }: UserFindManyArgs) {
    const [users, totalCount] = await this.prisma.$transaction([
      this.prisma.user.findMany({
        where: {
          name: {
            contains: search,
            mode: 'insensitive',
          },
        },
        skip: (pageIndex - 1) * pageSize,
        take: pageSize,
      }),
      this.prisma.user.count({
        where: {
          name: {
            contains: search,
            mode: 'insensitive',
          },
        },
      }),
    ]);
    return {
      users,
      totalCount,
    };
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

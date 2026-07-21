import { PrismaService } from '@/prisma/prisma.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProjectPayload, UpdateProjectPayload } from '@rh/shared/schemas';

@Injectable()
export class ProjectService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, data: CreateProjectPayload) {
    return this.prisma.project.create({
      data: {
        ...data,
        userId,
      },
    });
  }

  async findByUserId(userId: string) {
    return this.prisma.project.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async update(userId: string, projectId: string, data: UpdateProjectPayload) {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project || project.userId !== userId) {
      throw new NotFoundException('Project not found');
    }

    return this.prisma.project.update({
      where: { id: projectId },
      data,
    });
  }

  async delete(userId: string, projectId: string) {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project || project.userId !== userId) {
      throw new NotFoundException('Project not found');
    }

    return this.prisma.project.delete({
      where: { id: projectId },
    });
  }
}

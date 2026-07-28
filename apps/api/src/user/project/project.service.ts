import { PrismaService } from '@/prisma/prisma.service';
import { StorageService } from '@/storage/storage.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { ResumeProjectCreateInput } from '@rh/database/models';
import { CreateProjectPayload, UpdateProjectPayload } from '@rh/shared/schemas';

@Injectable()
export class ProjectService {
  constructor(
    private prisma: PrismaService,
    private storageService: StorageService,
  ) {}

  async create(
    userId: string,
    data: CreateProjectPayload & {
      image?: string;
    },
  ) {
    const newProject = await this.prisma.project.create({
      data: {
        ...data,
        userId,
      },
    });

    const userResumes = await this.prisma.resume.findMany({
      where: {
        userId,
      },
    });

    const userProjects = await this.findByUserId(userId);

    userResumes.forEach((resume) => {
      this.prisma.$transaction(async (tx) => {
        await tx.resumeProject.deleteMany({
          where: {
            resumeId: resume.id,
          },
        });
        await tx.resumeProject.createMany({
          data: userProjects.slice(0, 3).map((project) => ({
            projectId: project.id,
            resumeId: resume.id,
          })),
        });
      });
    });

    return newProject;
  }

  async findById(userId: string, id: string) {
    return this.prisma.project.findUnique({
      where: { userId, id },
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

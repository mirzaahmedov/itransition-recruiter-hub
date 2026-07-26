import { AuthUser } from '@/auth/decorators/auth-user.decorator';
import { makeResponse } from '@rh/shared/models';
import { StorageService } from '@/storage/storage.service';
import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';
import { User, UserRole } from '@rh/database/client';
import type { Express, Request } from 'express';
import { extname } from 'path';
import { nanoid } from 'nanoid';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { CreateProjectDto, UpdateProjectDto } from './project.dto';
import { ProjectService } from './project.service';
import { RolesGuard } from '@/auth/guards/roles.guard';
import { Roles } from '@/auth/decorators/roles.decorator';
import { parseObjectKeyFromImageURL } from '@/lib/storage';

@Controller('users/:userId/projects')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class ProjectController {
  constructor(
    private readonly projectService: ProjectService,
    private readonly storageService: StorageService,
  ) {}

  @Post()
  @Roles(UserRole.ADMINISTRATOR, UserRole.CANDIDATE)
  async create(
    @AuthUser() user: User,
    @Param('userId') userId: string,
    @Body() data: CreateProjectDto,
  ) {
    if (userId !== user.id && user.role !== UserRole.ADMINISTRATOR) {
      throw new ForbiddenException('You can only create projects for yourself');
    }
    return makeResponse(await this.projectService.create(user.id, data));
  }

  @Post(':id/image')
  @UseInterceptors(FileInterceptor('image'))
  @Roles(UserRole.ADMINISTRATOR, UserRole.CANDIDATE)
  async uploadImage(
    @Req() req: Request,
    @AuthUser() user: User,
    @Param('userId') userId: string,
    @Param('id') id: string,
    @UploadedFile() image: Express.Multer.File,
  ) {
    if (userId !== user.id && user.role !== UserRole.ADMINISTRATOR) {
      throw new ForbiddenException(
        'You can only upload images for your own projects',
      );
    }

    const project = await this.projectService.findById(userId, id);
    if (!project) {
      throw new NotFoundException('Project not found');
    }

    const key = nanoid() + extname(image.originalname);

    await this.storageService.upload(`images/${key}`, image);

    if (project.image) {
      try {
        const key = parseObjectKeyFromImageURL(project.image);
        const result = await this.storageService.delete(key);
        console.log(`delete ${key}`, result);
      } catch (error) {
        console.log(error);
      }
    }

    const baseUrl = `${req.protocol}://${req.headers.host}`;
    const imageUrl = `${baseUrl}/storage/${key}`;

    const updated = await this.projectService.update(user.id, id, {
      image: imageUrl,
    });

    return makeResponse(updated);
  }

  @Get()
  async findAll(@Param('userId') userId: string) {
    return makeResponse(await this.projectService.findByUserId(userId));
  }

  @Patch(':id')
  async update(
    @AuthUser() user: User,
    @Param('userId') userId: string,
    @Param('id') id: string,
    @Body() data: UpdateProjectDto,
  ) {
    if (userId !== user.id && user.role !== UserRole.ADMINISTRATOR) {
      throw new ForbiddenException('You can only update your own projects');
    }
    return makeResponse(await this.projectService.update(user.id, id, data));
  }

  @Delete(':id')
  async remove(
    @AuthUser() user: User,
    @Param('userId') userId: string,
    @Param('id') id: string,
  ) {
    if (userId !== user.id && user.role !== UserRole.ADMINISTRATOR) {
      throw new ForbiddenException('You can only delete your own projects');
    }
    return makeResponse(await this.projectService.delete(user.id, id));
  }
}

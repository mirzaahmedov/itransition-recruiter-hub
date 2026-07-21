import { AuthUser } from '@/auth/decorators/auth-user.decorator';
import { makeResponse } from '@/models/api';
import { StorageService } from '@/storage/storage.service';
import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
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
import { User } from '@rh/database/client';
import type { Express, Request } from 'express';
import { extname } from 'path';
import { nanoid } from 'nanoid';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { CreateProjectDto, UpdateProjectDto } from './project.dto';
import { ProjectService } from './project.service';

@Controller('users/:userId/projects')
export class ProjectController {
  constructor(
    private readonly projectService: ProjectService,
    private readonly s3Service: StorageService,
  ) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async create(
    @AuthUser() user: User,
    @Param('userId') userId: string,
    @Body() data: CreateProjectDto,
  ) {
    if (userId !== user.id) {
      throw new ForbiddenException('You can only create projects for yourself');
    }
    return makeResponse(await this.projectService.create(user.id, data));
  }

  @Post(':id/image')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FileInterceptor('image'))
  async uploadImage(
    @Req() req: Request,
    @AuthUser() user: User,
    @Param('userId') userId: string,
    @Param('id') id: string,
    @UploadedFile() image: Express.Multer.File,
  ) {
    if (userId !== user.id) {
      throw new ForbiddenException('You can only upload images for your own projects');
    }

    const key = nanoid() + extname(image.originalname);

    await this.s3Service.client.send(
      new PutObjectCommand({
        Bucket: process.env.S3_BUCKET,
        Key: `images/${key}`,
        Body: image.buffer,
        ContentType: image.mimetype,
      }),
    );

    const baseUrl = `${req.protocol}://${req.headers.host}`;
    const imageUrl = `${baseUrl}/storage/${key}`;

    const updated = await this.projectService.update(user.id, id, {
      image: imageUrl,
    });

    return makeResponse(updated);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  async findAll(@Param('userId') userId: string) {
    return makeResponse(await this.projectService.findByUserId(userId));
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  async update(
    @AuthUser() user: User,
    @Param('userId') userId: string,
    @Param('id') id: string,
    @Body() data: UpdateProjectDto,
  ) {
    if (userId !== user.id) {
      throw new ForbiddenException('You can only update your own projects');
    }
    return makeResponse(await this.projectService.update(user.id, id, data));
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  async remove(
    @AuthUser() user: User,
    @Param('userId') userId: string,
    @Param('id') id: string,
  ) {
    if (userId !== user.id) {
      throw new ForbiddenException('You can only delete your own projects');
    }
    return makeResponse(await this.projectService.delete(user.id, id));
  }
}

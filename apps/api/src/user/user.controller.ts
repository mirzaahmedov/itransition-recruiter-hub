import { makeResponse } from '@/models/api';
import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Patch,
  Put,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';
import { AuthUser } from '@/auth/decorators/auth-user.decorator';
import { User } from '@rh/database/client';
import { BulkUpdateUserRolesDto, UpdateUserProfileDto } from './user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { nanoid } from 'nanoid';

import { PutObjectCommand } from '@aws-sdk/client-s3';
import type { Express, Request } from 'express';
import { extname } from 'path';
import { StorageService } from '@/storage/storage.service';

@Controller('users')
export class UserController {
  constructor(
    private userService: UserService,
    private s3Service: StorageService,
  ) {}

  @Get()
  async findAll() {
    try {
      const users = await this.userService.findMany();
      return makeResponse(users);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  async findById(@Param('id') id: string) {
    try {
      const user = await this.userService.findById(id);
      if (!user) {
        throw new NotFoundException();
      }
      return makeResponse(user);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  @Put(':id/profile-picture')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FileInterceptor('image'))
  async uploadProfilePicture(
    @Req() req: Request,
    @AuthUser() user: User,
    @Param('id') id: string,
    @UploadedFile() image: Express.Multer.File,
  ) {
    try {
      if (user.id !== id) {
        throw new ForbiddenException();
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
      const avatarUrl = `${baseUrl}/storage/${key}`;

      return await this.userService.update(user.id, {
        avatar: avatarUrl,
      });
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  async update(
    @AuthUser() user: User,
    @Param('id') id: string,
    @Body() data: UpdateUserProfileDto,
  ) {
    try {
      if (user.id !== id) {
        throw new ForbiddenException();
      }
      const updated = await this.userService.update(id, data);
      return makeResponse(updated);
    } catch (error) {
      throw error;
    }
  }

  @Patch('bulk-change-roles')
  async bulkUpdateRoles(@Body() data: BulkUpdateUserRolesDto) {
    try {
      const { ids, role } = data;
      return await this.userService.bulkUpdateRoles(ids, role);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}

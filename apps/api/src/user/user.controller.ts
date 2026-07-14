import { makeResponse } from '@/models/api';
import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  NotFoundException,
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
import { UserBulkUpdateRolesDto } from './user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { nanoid } from 'nanoid';

import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
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
  async getUsers() {
    try {
      const users = await this.userService.findMany();
      return makeResponse(users);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  @Get('profile')
  @UseGuards(AuthGuard('jwt'))
  async getUserProfile(@AuthUser() user: User) {
    try {
      const profile = await this.userService.findByUserId(user.id);
      console.log({ profile });
      if (!profile) {
        throw new NotFoundException();
      }

      return makeResponse(profile);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  @Put('profile-picture')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FileInterceptor('image'))
  async uploadProfilePicture(
    @Req() req: Request,
    @AuthUser() user: User,
    @UploadedFile() image: Express.Multer.File,
  ) {
    try {
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

  @Patch('bulk-change-roles')
  async updateRoles(@Body() data: UserBulkUpdateRolesDto) {
    try {
      const { ids, role } = data;
      return await this.userService.bulkUpdateRoles(ids, role);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}

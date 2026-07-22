import { makeResponse } from '@/models/api';
import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
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
import { User, UserRole } from '@rh/database/client';
import {
  BulkDeleteUsersDto,
  BulkUpdateUserRolesDto,
  UpdateUserProfileDto,
} from './user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { nanoid } from 'nanoid';

import { PutObjectCommand } from '@aws-sdk/client-s3';
import type { Express, Request } from 'express';
import { extname } from 'path';
import { StorageService } from '@/storage/storage.service';
import { Roles } from '@/auth/decorators/roles.decorator';
import { RolesGuard } from '@/auth/guards/roles.guard';

@Controller('users')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class UserController {
  constructor(
    private userService: UserService,
    private s3Service: StorageService,
  ) {}

  @Get()
  @Roles(UserRole.ADMINISTRATOR)
  async findAll() {
    const users = await this.userService.findMany();
    return makeResponse(users);
  }

  @Get('candidates')
  async findCandidates() {
    const users = await this.userService.findCandidates();
    return makeResponse(users);
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    const user = await this.userService.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return makeResponse(user);
  }

  @Put(':id/profile-picture')
  @UseInterceptors(FileInterceptor('image'))
  async uploadProfilePicture(
    @Req() req: Request,
    @AuthUser() user: User,
    @Param('id') id: string,
    @UploadedFile() image: Express.Multer.File,
  ) {
    if (user.id !== id) {
      throw new ForbiddenException(
        'You can only update your own profile picture',
      );
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

    const updated = await this.userService.update(user.id, {
      avatar: avatarUrl,
    });

    return makeResponse(updated);
  }

  @Patch('bulk-change-roles')
  async bulkUpdateRoles(@Body() data: BulkUpdateUserRolesDto) {
    const { ids, role } = data;
    await this.userService.bulkUpdateRoles(ids, role);
    return makeResponse({ updated: ids.length });
  }

  @Delete('bulk')
  async bulkDelete(@Body() data: BulkDeleteUsersDto) {
    const { ids } = data;
    await this.userService.bulkDelete(ids);
    return makeResponse({ deleted: ids.length });
  }

  @Patch(':id')
  async update(
    @AuthUser() user: User,
    @Param('id') id: string,
    @Body() data: UpdateUserProfileDto,
  ) {
    if (user.id !== id) {
      throw new ForbiddenException('You can only update your own profile');
    }
    const updated = await this.userService.update(id, data);
    return makeResponse(updated);
  }
}

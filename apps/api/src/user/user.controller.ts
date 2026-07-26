import { AuthUser } from '@/auth/decorators/auth-user.decorator';
import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Put,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { User, UserRole } from '@rh/database/client';
import { makeResponse } from '@rh/shared/models';
import { nanoid } from 'nanoid';
import {
  BulkDeleteUsersDto,
  BulkUpdateUserRolesDto,
  UpdateUserProfileDto,
} from './user.dto';
import { UserService } from './user.service';

import { Roles } from '@/auth/decorators/roles.decorator';
import { RolesGuard } from '@/auth/guards/roles.guard';
import { ResumeService } from '@/position/resume/resume.service';
import { ResumeLikeService } from '@/resume-like/resume-like.service';
import { StorageService } from '@/storage/storage.service';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { makePaginatedResponse } from '@rh/shared/models';
import type { Request } from 'express';
import path, { extname } from 'path';
import { parseObjectKeyFromImageURL } from '@/lib/storage';

@Controller('users')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class UserController {
  constructor(
    private userService: UserService,
    private storageService: StorageService,
    private resumeService: ResumeService,
    private resumeLikeService: ResumeLikeService,
  ) {}

  @Get()
  @Roles(UserRole.ADMINISTRATOR)
  async findAll(
    @Query('search') search: string,
    @Query('pageIndex', ParseIntPipe) pageIndex: number,
    @Query('pageSize', ParseIntPipe) pageSize: number,
  ) {
    const { users, totalCount } = await this.userService.findMany({
      search,
      pageIndex,
      pageSize,
    });

    return makePaginatedResponse(users, totalCount);
  }

  @Get('candidates')
  @Roles(UserRole.RECRUITER, UserRole.ADMINISTRATOR)
  async findCandidates() {
    const users = await this.userService.findCandidates();
    return makeResponse(users);
  }

  @Get(':id')
  async findById(@Param('id') id: string, @AuthUser() authUser: User) {
    if (authUser.role === UserRole.CANDIDATE && id !== authUser.id) {
      throw new ForbiddenException();
    }
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

    await this.storageService.upload(key, image);
    if (user.avatar) {
      try {
        const key = parseObjectKeyFromImageURL(user.avatar);
        const result = await this.storageService.delete(key);
        console.log(`deleted ${key}`, result);
      } catch (error) {
        console.log(error);
      }
    }

    const baseUrl = `${req.protocol}://${req.headers.host}`;
    const avatarUrl = `${baseUrl}/storage/${key}`;

    return makeResponse(
      await this.userService.update(user.id, {
        avatar: avatarUrl,
      }),
    );
  }

  @Patch('bulk-change-roles')
  @Roles(UserRole.ADMINISTRATOR)
  async bulkUpdateRoles(@Body() data: BulkUpdateUserRolesDto) {
    const { ids, role } = data;
    await this.userService.bulkUpdateRoles(ids, role);
    return makeResponse({ updated: ids.length });
  }

  @Delete('bulk')
  @Roles(UserRole.ADMINISTRATOR)
  async bulkDelete(@Body() data: BulkDeleteUsersDto) {
    const { ids } = data;
    await this.userService.bulkDelete(ids);
    return makeResponse({ deleted: ids.length });
  }

  @Patch(':id')
  @Roles(UserRole.ADMINISTRATOR, UserRole.CANDIDATE)
  async update(
    @AuthUser() user: User,
    @Param('id') id: string,
    @Body() data: UpdateUserProfileDto,
  ) {
    if (user.id !== id && user.role !== UserRole.ADMINISTRATOR) {
      throw new ForbiddenException('You can only update your own profile');
    }
    const updated = await this.userService.update(id, data);
    return makeResponse(updated);
  }

  @Get(':id/resumes')
  async findResumes(@Param('id') id: string, @AuthUser() user: User) {
    if (user.role === UserRole.CANDIDATE && user.id !== id) {
      throw new ForbiddenException();
    }
    const resumes = await this.resumeService.findAllByUser(id);
    return makeResponse(resumes);
  }

  @Get('resume-likes')
  @Roles(UserRole.RECRUITER)
  async findResumeLikes(@AuthUser() user: User) {
    const resumeLikes = await this.resumeLikeService.findAll(user.id);
    return makeResponse(resumeLikes);
  }
}

import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpStatus,
} from '@nestjs/common';
import { ProfileAttributeService } from './profile-attribute.service';
import {
  ProfileAttributeCreatePayload,
  ProfileAttributeUpdatePayload,
} from '@rh/shared';
import { AuthGuard } from '@nestjs/passport';
import { AuthUser } from '@/auth/decorators/auth-user.decorator';
import { User } from '@rh/database/client';
import { ProfileService } from '@/profile/profile-attribute.service';
import { err } from '@/models/api';

@Controller('profile-attributes')
export class ProfileAttributeController {
  constructor(
    private readonly profileAttributeService: ProfileAttributeService,
    private readonly profileService: ProfileService,
  ) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async create(
    @Body() payload: ProfileAttributeCreatePayload,
    @AuthUser() user: User,
  ) {
    const profile = await this.profileService.findByUserId(user.id);
    if (!profile) {
      return null;
    }
    return this.profileAttributeService.create({
      attrId: payload.attrId,
      profileId: profile.id,
    });
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  async update(
    @Body() payload: ProfileAttributeUpdatePayload,
    @Param('id') id: string,
    @AuthUser() user: User,
  ) {
    const profile = await this.profileService.findByUserId(user.id);
    if (!profile) {
      return err(HttpStatus.NOT_FOUND);
    }

    return await this.profileAttributeService.update(
      {
        id,
        profileId: profile.id,
      },
      payload,
    );
  }
}

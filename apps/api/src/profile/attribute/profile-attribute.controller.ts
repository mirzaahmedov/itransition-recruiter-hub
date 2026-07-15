import { AuthUser } from '@/auth/decorators/auth-user.decorator';
import { UserProfileService } from '@/profile/profile.service';
import {
  Body,
  Controller,
  ForbiddenException,
  InternalServerErrorException,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from '@rh/database/client';
import {
  ProfileAttributeCreateDto,
  ProfileAttributeUpdateDto,
} from './profile-attribute.dto';
import { ProfileAttributeService } from './profile-attribute.service';

@Controller('profile/:profileId/attributes')
export class ProfileAttributeController {
  constructor(
    private readonly profileAttributeService: ProfileAttributeService,
    private readonly userProfileService: UserProfileService,
  ) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async create(
    @AuthUser() user: User,
    @Body() data: ProfileAttributeCreateDto,
  ) {
    try {
      const profile = await this.userProfileService.findByUserId(user.id);
      if (!profile) {
        throw new NotFoundException('Profile not found');
      }

      return this.profileAttributeService.create({
        attrId: data.attrId,
        profileId: profile.id,
      });
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  async update(
    @AuthUser() user: User,
    @Param('id') id: string,
    @Query('version', ParseIntPipe) version: number,
    @Body() payload: ProfileAttributeUpdateDto,
  ) {
    try {
      const profile = await this.userProfileService.findByUserId(user.id);
      if (!profile) {
        throw new NotFoundException('Profile not found');
      }

      const exists = await this.profileAttributeService.findById(id);
      if (!exists) {
        throw new NotFoundException('Profile attribute not found');
      }

      if (exists.profileId !== profile.id) {
        throw new ForbiddenException();
      }

      return await this.profileAttributeService.update(
        {
          id,
          version,
          profileId: profile.id,
        },
        payload,
      );
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}

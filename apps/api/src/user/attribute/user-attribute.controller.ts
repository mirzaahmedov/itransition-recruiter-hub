import { AuthUser } from '@/auth/decorators/auth-user.decorator';
import { makeResponse } from '@/models/api';
import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  InternalServerErrorException,
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
  ProfileAttributeCreateBulkDto,
  ProfileAttributeUpdateDto,
} from './user-attribute.dto';
import { UserAttributeService } from './user-attribute.service';

@Controller('users/:userId/attributes')
export class UserAttributeController {
  constructor(private readonly userAttributeService: UserAttributeService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async createBulk(
    @AuthUser() user: User,
    @Param('userId') userId: string,
    @Body() data: ProfileAttributeCreateBulkDto,
  ) {
    try {
      if (userId !== user.id) {
        throw new ForbiddenException();
      }

      return this.userAttributeService.createBulk({
        ids: data.ids,
        userId: user.id,
      });
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  async getProfileAttributes(
    @AuthUser() user: User,
    @Param('userId') userId: string,
  ) {
    try {
      if (userId !== user.id) {
        throw new ForbiddenException();
      }

      return makeResponse(
        await this.userAttributeService.findUserAttributes(user.id),
      );
    } catch (error) {
      console.log('error', error);
      throw new InternalServerErrorException();
    }
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  async update(
    @AuthUser() user: User,
    @Param('userId') userId: string,
    @Param('id') id: string,
    @Query('version', ParseIntPipe) version: number,
    @Body() payload: ProfileAttributeUpdateDto,
  ) {
    try {
      if (userId !== user.id) {
        throw new ForbiddenException();
      }

      return await this.userAttributeService.update(
        {
          id,
          version,
          userId,
        },
        payload,
      );
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }
}

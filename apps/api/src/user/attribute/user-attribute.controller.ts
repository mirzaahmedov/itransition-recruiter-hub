import { AuthUser } from '@/auth/decorators/auth-user.decorator';
import { makeResponse } from '@/models/api';
import {
  Body,
  Controller,
  ForbiddenException,
  Get,
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
  BulkUpdateUserProfileAttributeDto,
  BulkCreateUserProfileAttributeDto,
  UpdateUserProfileAttributeDto,
} from './user-attribute.dto';
import { UserAttributeService } from './user-attribute.service';

@Controller('users/:userId/attributes')
export class UserAttributeController {
  constructor(private readonly userAttributeService: UserAttributeService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async bulkCreate(
    @AuthUser() user: User,
    @Param('userId') userId: string,
    @Body() data: BulkCreateUserProfileAttributeDto,
  ) {
    if (userId !== user.id) {
      throw new ForbiddenException(
        'You can only add attributes to your own profile',
      );
    }

    return makeResponse(
      await this.userAttributeService.bulkCreate({
        ids: data.ids,
        userId: user.id,
      }),
    );
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  async findAll(@Param('userId') userId: string) {
    return makeResponse(
      await this.userAttributeService.findByUserId(userId, true),
    );
  }

  @Patch('bulk')
  @UseGuards(AuthGuard('jwt'))
  async bulkUpdate(
    @AuthUser() user: User,
    @Param('userId') userId: string,
    @Body() data: BulkUpdateUserProfileAttributeDto,
  ) {
    if (userId !== user.id) {
      throw new ForbiddenException('You can only update your own attributes');
    }

    return makeResponse(
      await this.userAttributeService.bulkUpdate(
        {
          userId,
        },
        data,
      ),
    );
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  async update(
    @AuthUser() user: User,
    @Param('userId') userId: string,
    @Param('id') id: string,
    @Query('version', ParseIntPipe) version: number,
    @Body() payload: UpdateUserProfileAttributeDto,
  ) {
    if (userId !== user.id) {
      throw new ForbiddenException('You can only update your own attributes');
    }

    return makeResponse(
      await this.userAttributeService.update(
        {
          id,
          version,
          userId,
        },
        payload,
      ),
    );
  }
}

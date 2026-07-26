import { AuthUser } from '@/auth/decorators/auth-user.decorator';
import { makeResponse } from '@rh/shared/models';
import {
  Body,
  Controller,
  ForbiddenException,
  Get,
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
  BulkUpdateUserProfileAttributeDto,
  BulkCreateUserProfileAttributeDto,
  UpdateUserProfileAttributeDto,
} from './user-attribute.dto';
import { UserAttributeService } from './user-attribute.service';
import { RolesGuard } from '@/auth/guards/roles.guard';

@Controller('users/:userId/attributes')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class UserAttributeController {
  constructor(private readonly userAttributeService: UserAttributeService) {}

  @Post()
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
  async findAll(@Param('userId') userId: string) {
    return makeResponse(
      await this.userAttributeService.findByUserId(userId, true),
    );
  }

  @Get(':id')
  async findById(@Param('userId') userId: string, @Param('id') id: string) {
    const attr = await this.userAttributeService.findById(userId, id);
    if (!attr) {
      throw new NotFoundException('Attribute not found');
    }
    return makeResponse(attr);
  }

  @Patch('bulk')
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

import { makeResponse } from '@/models/api';
import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  BulkCreatePositionAttributesDto,
  CreatePositionDto,
  UpdatePositionDto,
  UpdatePositionStatusDto,
} from './position.dto';
import { PositionService } from './position.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '@/auth/guards/roles.guard';
import { AuthUser } from '@/auth/decorators/auth-user.decorator';
import { User, UserRole } from '@rh/database/client';
import { Roles } from '@/auth/decorators/roles.decorator';

@Controller('positions')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class PositionController {
  constructor(private readonly positionService: PositionService) {}

  @Post()
  @Roles(UserRole.ADMINISTRATOR, UserRole.RECRUITER)
  async create(@Body() data: CreatePositionDto) {
    return makeResponse(await this.positionService.create(data));
  }

  @Get()
  async findAll(@Query('search') search: string) {
    return makeResponse(
      await this.positionService.findAll({
        search,
      }),
    );
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @AuthUser() user: User) {
    if (user.role === UserRole.CANDIDATE) {
      return makeResponse(
        await this.positionService.findOne({ id, userId: user.id }),
      );
    }
    return makeResponse(await this.positionService.findOne({ id }));
  }

  @Patch(':id')
  @Roles(UserRole.ADMINISTRATOR, UserRole.RECRUITER)
  async update(@Param('id') id: string, @Body() data: UpdatePositionDto) {
    return makeResponse(await this.positionService.update(id, data));
  }

  @Patch(':id/status')
  @Roles(UserRole.ADMINISTRATOR, UserRole.RECRUITER)
  async updateStatus(
    @Param('id') id: string,
    @Body() data: UpdatePositionStatusDto,
  ) {
    console.log({ data });
    return makeResponse(
      await this.positionService.updateStatus(id, data.status),
    );
  }

  @Post(':id/attributes/bulk-create')
  @Roles(UserRole.ADMINISTRATOR, UserRole.RECRUITER)
  async addAttributes(
    @Param('id') id: string,
    @Body() data: BulkCreatePositionAttributesDto,
  ) {
    const { ids } = data;
    return makeResponse(await this.positionService.bulkAddAttributes(id, ids));
  }

  @Delete(':id/attributes/:attributeId')
  @Roles(UserRole.ADMINISTRATOR, UserRole.RECRUITER)
  async removeAttribute(
    @Param('id') id: string,
    @Param('attributeId') attributeId: string,
  ) {
    return makeResponse(
      await this.positionService.removeAttribute(id, attributeId),
    );
  }

  @Delete(':id')
  @Roles(UserRole.ADMINISTRATOR, UserRole.RECRUITER)
  async delete(@Param('id') id: string) {
    return makeResponse(await this.positionService.delete(id));
  }
}

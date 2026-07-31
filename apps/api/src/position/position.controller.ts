import { AuthUser } from '@/auth/decorators/auth-user.decorator';
import { Roles } from '@/auth/decorators/roles.decorator';
import { RolesGuard } from '@/auth/guards/roles.guard';
import {
  Body,
  Controller,
  Delete,
  Get,
  Header,
  Headers,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User, UserRole } from '@rh/database/client';
import { makeResponse } from '@rh/shared/models';
import {
  BulkCreatePositionAttributesDto,
  CreatePositionDto,
  FindAllPositionParamsDto,
  UpdatePositionDto,
  UpdatePositionStatusDto,
} from './position.dto';
import { PositionService } from './position.service';
import { createHash, randomBytes } from 'crypto';

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
  async findAll(
    @AuthUser() user: User,
    @Query() params: FindAllPositionParamsDto,
  ) {
    const { search = '', sortBy, sortOrder } = params;
    return makeResponse(
      await this.positionService.findAll(
        {
          search,
          user,
        },
        {
          sortBy,
          sortOrder,
        },
      ),
    );
  }

  @Post(':id/api-keys')
  async createApiKey(@Param('id') positionId: string) {
    const { rawToken } = await this.positionService.createApiKey(positionId);
    return makeResponse({
      rawToken,
    });
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

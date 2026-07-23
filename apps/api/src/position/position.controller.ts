import { makeResponse } from '@/models/api';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CreatePositionDto, UpdatePositionDto } from './position.dto';
import { PositionService } from './position.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '@/auth/guards/roles.guard';
import { AuthUser } from '@/auth/decorators/auth-user.decorator';
import { User, UserRole } from '@rh/database/client';

@Controller('positions')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class PositionController {
  constructor(private readonly positionService: PositionService) {}

  @Post()
  async create(@Body() data: CreatePositionDto) {
    return makeResponse(await this.positionService.create(data));
  }

  @Get()
  async findAll() {
    return makeResponse(await this.positionService.findAll());
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @AuthUser() user: User) {
    if (user.role === UserRole.CANDIDATE) {
      return makeResponse(await this.positionService.findOne(id, user.id));
    }
    return makeResponse(await this.positionService.findOne(id));
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() payload: UpdatePositionDto) {
    return makeResponse(await this.positionService.update(id, payload));
  }

  @Post(':id/attributes')
  async addAttribute(
    @Param('id') id: string,
    @Body('attributeId') attributeId: string,
  ) {
    return makeResponse(
      await this.positionService.addAttribute(id, attributeId),
    );
  }

  @Delete(':id/attributes/:attributeId')
  async removeAttribute(
    @Param('id') id: string,
    @Param('attributeId') attributeId: string,
  ) {
    return makeResponse(
      await this.positionService.removeAttribute(id, attributeId),
    );
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return makeResponse(await this.positionService.delete(id));
  }
}

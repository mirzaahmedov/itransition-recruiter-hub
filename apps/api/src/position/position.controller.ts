import { makeResponse } from '@/models/api';
import {
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreatePositionDto, UpdatePositionDto } from './position.dto';
import { PositionService } from './position.service';

@Controller('positions')
export class PositionController {
  constructor(private readonly positionService: PositionService) {}

  @Post()
  async create(@Body() data: CreatePositionDto) {
    try {
      return makeResponse(await this.positionService.create(data));
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  @Get()
  async findAll() {
    try {
      return makeResponse(await this.positionService.findAll());
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      return makeResponse(await this.positionService.findOne(id));
    } catch (error) {
      throw error;
    }
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() payload: UpdatePositionDto) {
    try {
      return makeResponse(await this.positionService.update(id, payload));
    } catch (error) {
      throw error;
    }
  }

  @Post(':id/attributes')
  async addAttribute(
    @Param('id') id: string,
    @Body('attributeId') attributeId: string,
  ) {
    try {
      return makeResponse(
        await this.positionService.addAttribute(id, attributeId),
      );
    } catch (error) {
      throw error;
    }
  }

  @Delete(':id/attributes/:attributeId')
  async removeAttribute(
    @Param('id') id: string,
    @Param('attributeId') attributeId: string,
  ) {
    try {
      return makeResponse(
        await this.positionService.removeAttribute(id, attributeId),
      );
    } catch (error) {
      throw error;
    }
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    try {
      return makeResponse(await this.positionService.delete(id));
    } catch (error) {
      throw error;
    }
  }
}

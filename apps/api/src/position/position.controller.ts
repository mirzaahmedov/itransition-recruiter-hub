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
import { PositionCreatePayload } from '@rh/shared';
import { PositionCreateDto } from './position.dto';
import { PositionService } from './position.service';

@Controller('positions')
export class PositionController {
  constructor(private readonly positionService: PositionService) {}

  @Post()
  create(@Body() data: PositionCreateDto) {
    try {
      return this.positionService.create(data);
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
  findOne(@Param('id') id: string) {
    return this.positionService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() payload: PositionCreatePayload) {
    return this.positionService.update(+id, payload);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.positionService.remove(+id);
  }
}

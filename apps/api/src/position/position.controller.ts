import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PositionService } from './position.service';
import { PositionCreatePayload } from '@rh/shared';
import { ok } from '@/models/api';

@Controller('positions')
export class PositionController {
  constructor(private readonly positionService: PositionService) {}

  @Post()
  create(@Body() payload: PositionCreatePayload) {
    return this.positionService.create(payload);
  }

  @Get()
  async findAll() {
    return ok(await this.positionService.findAll());
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

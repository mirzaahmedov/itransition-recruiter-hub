import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { AttributeService } from './attribute.service';
import type { AttributeCreateInput, AttributeUpdateInput } from '@rh/core';
import { ok } from '@/models/api';

@Controller('attributes')
export class AttributeController {
  constructor(private readonly attributeService: AttributeService) {}

  @Post()
  create(@Body() payload: AttributeCreateInput) {
    return this.attributeService.create(payload);
  }

  @Get()
  findAll(@Query() categoryId: string) {
    return ok(this.attributeService.findAll(categoryId));
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.attributeService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() payload: AttributeUpdateInput) {
    return this.attributeService.update(id, payload);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.attributeService.remove(id);
  }
}

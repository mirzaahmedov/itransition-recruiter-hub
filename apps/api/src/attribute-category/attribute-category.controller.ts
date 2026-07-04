import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { AttributeCategoryService } from './attribute-category.service';
import type {
  AttributeCategoryCreateInput,
  AttributeCategoryUpdateInput,
} from '@rh/core';
import { ok } from '@/models/api';

@Controller('attribute-categories')
export class AttributeCategoryController {
  constructor(private categoryService: AttributeCategoryService) {}

  @Get()
  async getAll() {
    return ok(await this.categoryService.getAll());
  }

  @Post()
  async create(@Body() payload: AttributeCategoryCreateInput) {
    return ok(await this.categoryService.create(payload));
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() payload: AttributeCategoryUpdateInput,
  ) {
    return ok(await this.categoryService.update(id, payload));
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return ok(await this.categoryService.delete(id));
  }
}

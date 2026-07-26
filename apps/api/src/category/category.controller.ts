import { makeResponse } from '@rh/shared/models';
import { Controller, Get } from '@nestjs/common';
import { CategoryService } from './category.service';

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  async findAll() {
    return makeResponse(await this.categoryService.findAll());
  }
}

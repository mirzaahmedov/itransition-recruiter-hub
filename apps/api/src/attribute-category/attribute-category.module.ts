import { Module } from '@nestjs/common';
import { AttributeCategoryService } from './attribute-category.service';
import { AttributeCategoryController } from './attribute-category.controller';

@Module({
  providers: [AttributeCategoryService],
  controllers: [AttributeCategoryController],
})
export class AttributeCategoryModule {}

import { ATTRIBUTE_CATEGORIES } from '@/data/categories';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CategoryService {
  findAll() {
    return ATTRIBUTE_CATEGORIES;
  }
}

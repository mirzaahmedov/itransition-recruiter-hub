import { Test, TestingModule } from '@nestjs/testing';
import { AttributeCategoryService } from './attribute-category.service';

describe('AttributeCategoryService', () => {
  let service: AttributeCategoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AttributeCategoryService],
    }).compile();

    service = module.get<AttributeCategoryService>(AttributeCategoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

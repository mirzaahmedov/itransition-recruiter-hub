import { Test, TestingModule } from '@nestjs/testing';
import { AttributeCategoryController } from './attribute-category.controller';

describe('AttributeCategoryController', () => {
  let controller: AttributeCategoryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AttributeCategoryController],
    }).compile();

    controller = module.get<AttributeCategoryController>(AttributeCategoryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

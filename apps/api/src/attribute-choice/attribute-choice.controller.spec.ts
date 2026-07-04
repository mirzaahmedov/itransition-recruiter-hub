import { Test, TestingModule } from '@nestjs/testing';
import { AttributeChoiceController } from './attribute-choice.controller';
import { AttributeChoiceService } from './attribute-choice.service';

describe('AttributeChoiceController', () => {
  let controller: AttributeChoiceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AttributeChoiceController],
      providers: [AttributeChoiceService],
    }).compile();

    controller = module.get<AttributeChoiceController>(AttributeChoiceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

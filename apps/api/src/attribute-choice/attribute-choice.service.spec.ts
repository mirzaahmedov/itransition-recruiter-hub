import { Test, TestingModule } from '@nestjs/testing';
import { AttributeChoiceService } from './attribute-choice.service';

describe('AttributeChoiceService', () => {
  let service: AttributeChoiceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AttributeChoiceService],
    }).compile();

    service = module.get<AttributeChoiceService>(AttributeChoiceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

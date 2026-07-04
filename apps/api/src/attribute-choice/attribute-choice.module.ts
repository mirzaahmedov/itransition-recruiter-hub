import { Module } from '@nestjs/common';
import { AttributeChoiceService } from './attribute-choice.service';
import { AttributeChoiceController } from './attribute-choice.controller';

@Module({
  controllers: [AttributeChoiceController],
  providers: [AttributeChoiceService],
})
export class AttributeChoiceModule {}

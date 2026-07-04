import { Injectable } from '@nestjs/common';
import { CreateAttributeChoiceDto } from './dto/create-attribute-choice.dto';
import { UpdateAttributeChoiceDto } from './dto/update-attribute-choice.dto';

@Injectable()
export class AttributeChoiceService {
  create(createAttributeChoiceDto: CreateAttributeChoiceDto) {
    return 'This action adds a new attributeChoice';
  }

  findAll() {
    return `This action returns all attributeChoice`;
  }

  findOne(id: number) {
    return `This action returns a #${id} attributeChoice`;
  }

  update(id: number, updateAttributeChoiceDto: UpdateAttributeChoiceDto) {
    return `This action updates a #${id} attributeChoice`;
  }

  remove(id: number) {
    return `This action removes a #${id} attributeChoice`;
  }
}

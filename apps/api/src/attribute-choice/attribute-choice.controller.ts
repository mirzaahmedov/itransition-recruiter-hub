import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AttributeChoiceService } from './attribute-choice.service';
import { CreateAttributeChoiceDto } from './dto/create-attribute-choice.dto';
import { UpdateAttributeChoiceDto } from './dto/update-attribute-choice.dto';
import { ok } from '@/models/api';

@Controller('attribute-choices')
export class AttributeChoiceController {
  constructor(
    private readonly attributeChoiceService: AttributeChoiceService,
  ) {}

  @Post()
  create(@Body() createAttributeChoiceDto: CreateAttributeChoiceDto) {
    return ok(this.attributeChoiceService.create(createAttributeChoiceDto));
  }

  @Get()
  findAll() {
    return ok(this.attributeChoiceService.findAll());
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.attributeChoiceService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateAttributeChoiceDto: UpdateAttributeChoiceDto,
  ) {
    return this.attributeChoiceService.update(+id, updateAttributeChoiceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.attributeChoiceService.remove(+id);
  }
}

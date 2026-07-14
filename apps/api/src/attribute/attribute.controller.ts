import { makeResponse } from '@/models/api';
import {
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { AttributeRenamePayload } from '@rh/shared';
import { AttributeCreateDto } from './attribute.dto';
import { AttributeService } from './attribute.service';

@Controller('attributes')
export class AttributeController {
  constructor(private readonly attributeService: AttributeService) {}

  @Post()
  async create(@Body() data: AttributeCreateDto) {
    try {
      const { name, type, categoryId, choices = [] } = data;

      const attr = await this.attributeService.create({
        name,
        type,
        categoryId,
        choices,
      });

      return makeResponse(attr);
    } catch (err) {
      throw new InternalServerErrorException();
    }
  }

  @Patch(':id/rename')
  async rename(@Body() data: AttributeRenamePayload, @Param() id: string) {
    try {
      const { name } = data;

      const attr = await this.attributeService.rename(id, name);

      return makeResponse(attr);
    } catch (err) {
      throw new InternalServerErrorException();
    }
  }

  @Get('search')
  async search(@Query('search') search: string) {
    return await this.attributeService.search(search);
  }

  @Get()
  async findAll(@Query('categoryId') categoryId: string) {
    const attrs = await this.attributeService.findAll(categoryId);
    return makeResponse(attrs);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.attributeService.findOne(id);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.attributeService.remove(id);
  }
}

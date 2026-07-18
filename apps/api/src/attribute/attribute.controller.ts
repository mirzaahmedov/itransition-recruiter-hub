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
import { UpdateAttributePayload } from '@rh/shared';
import { CreateAttributeDto } from './attribute.dto';
import { AttributeService } from './attribute.service';

@Controller('attributes')
export class AttributeController {
  constructor(private readonly attributeService: AttributeService) {}

  @Post()
  async create(@Body() data: CreateAttributeDto) {
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
  async update(@Body() data: UpdateAttributePayload, @Param() id: string) {
    try {
      const { name } = data;

      const attr = await this.attributeService.update(id, name);

      return makeResponse(attr);
    } catch (err) {
      throw new InternalServerErrorException();
    }
  }

  @Get('search')
  async search(
    @Query('q') q: string,
    @Query('categoryId') categoryId?: string,
  ) {
    return makeResponse(await this.attributeService.search(q, categoryId));
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
  async delete(@Param('id') id: string) {
    return this.attributeService.delete(id);
  }
}

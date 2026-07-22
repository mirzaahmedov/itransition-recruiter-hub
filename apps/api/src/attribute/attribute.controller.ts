import { makeResponse } from '@/models/api';
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { UpdateAttributePayload } from '@rh/shared';
import { CreateAttributeDto } from './attribute.dto';
import { AttributeService } from './attribute.service';
import { makePaginatedResponse } from '@rh/shared/models';

@Controller('attributes')
export class AttributeController {
  constructor(private readonly attributeService: AttributeService) {}

  @Post()
  async create(@Body() data: CreateAttributeDto) {
    const { name, type, categoryId, choices = [] } = data;

    const attr = await this.attributeService.create({
      name,
      type,
      categoryId,
      choices,
    });

    return makeResponse(attr);
  }

  @Patch(':id/rename')
  async update(@Body() data: UpdateAttributePayload, @Param() id: string) {
    const { name } = data;

    const attr = await this.attributeService.update(id, name);

    return makeResponse(attr);
  }

  @Get('search')
  async search(
    @Query('q') q: string,
    @Query('categoryId') categoryId?: string,
  ) {
    return makeResponse(await this.attributeService.search(q, categoryId));
  }

  @Get()
  async findMany(
    @Query('search') search: string,
    @Query('pageIndex', ParseIntPipe) pageIndex: number,
    @Query('pageSize', ParseIntPipe) pageSize: number,
    @Query('categoryId') categoryId?: string,
  ) {
    const { attributes, totalCount } = await this.attributeService.findMany({
      categoryId,
      search,
      pageIndex,
      pageSize,
    });
    return makePaginatedResponse(attributes, totalCount);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return makeResponse(await this.attributeService.findOne(id));
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    const used = await this.attributeService.isUsed(id);
    if (used) {
      throw new BadRequestException(
        'Attribute is in use and cannot be deleted',
      );
    }
    return makeResponse(await this.attributeService.delete(id));
  }
}

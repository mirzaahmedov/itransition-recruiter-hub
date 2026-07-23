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
  UseGuards,
} from '@nestjs/common';
import { UpdateAttributePayload } from '@rh/shared';
import {
  AddAttributeChoiceDto,
  BulkDeleteAttributesDto,
  CreateAttributeDto,
  RenameAttributeChoiceDto,
} from './attribute.dto';
import { AttributeService } from './attribute.service';
import { makePaginatedResponse } from '@rh/shared/models';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '@/auth/guards/roles.guard';

@Controller('attributes')
@UseGuards(AuthGuard('jwt'), RolesGuard)
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
  async update(@Body() data: UpdateAttributePayload, @Param('id') id: string) {
    const { name } = data;

    const attr = await this.attributeService.update(id, name);

    return makeResponse(attr);
  }

  @Post(':id/choices')
  async addChoice(
    @Param('id') id: string,
    @Body() data: AddAttributeChoiceDto,
  ) {
    const choice = await this.attributeService.addChoice(id, data.value);
    return makeResponse(choice);
  }

  @Patch(':id/choices/:choiceId')
  async renameChoice(
    @Param('id') id: string,
    @Param('choiceId') choiceId: string,
    @Body() data: RenameAttributeChoiceDto,
  ) {
    const choice = await this.attributeService.renameChoice(
      id,
      choiceId,
      data.value,
    );
    return makeResponse(choice);
  }

  @Delete(':id/choices/:choiceId')
  async removeChoice(
    @Param('id') id: string,
    @Param('choiceId') choiceId: string,
  ) {
    await this.attributeService.removeChoice(id, choiceId);
    return makeResponse({ success: true });
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

  @Delete('bulk')
  async bulkDelete(@Body() data: BulkDeleteAttributesDto) {
    const { ids } = data;
    const { deleted: count } = await this.attributeService.bulkDelete(ids);
    return makeResponse({ deleted: count });
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

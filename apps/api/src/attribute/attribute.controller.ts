import { ok } from '@/models/api';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { AttributeCreateSchema } from '@rh/shared';
import { Response } from 'express';
import { AttributeService } from './attribute.service';

@Controller('attributes')
export class AttributeController {
  constructor(private readonly attributeService: AttributeService) {}

  @Post()
  async create(@Res() res: Response, @Body() payload: unknown) {
    try {
      const result = AttributeCreateSchema.safeParse(payload);
      if (!result.success) {
        res.status(HttpStatus.BAD_REQUEST).send(result.error);
        return;
      }
      const { name, type, categoryId, choices = [] } = result.data;
      const attr = await this.attributeService.create({
        name,
        type,
        categoryId,
        choices,
      });
      res.status(HttpStatus.CREATED).send(ok(attr));
    } catch (err) {
      console.log({ err });
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send('Internal server error');
    }
  }

  @Get('search')
  async search(@Query('search') search: string) {
    return await this.attributeService.search(search);
  }

  @Get()
  async findAll(@Query('categoryId') categoryId: string) {
    const attrs = await this.attributeService.findAll(categoryId);
    return ok(attrs);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.attributeService.findOne(id);
  }

  // @Patch(':id')
  // update(
  //   @Res() res: Response,
  //   @Param('id') id: string,
  //   @Body() payload: AttributeCreatePayload,
  // ) {
  //   try {
  //     return this.attributeService.update(id, payload);
  //   } catch (error) {
  //     res.status(HttpStatus.INTERNAL_SERVER_ERROR).send('Something went wrong');
  //   }
  // }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.attributeService.remove(id);
  }
}

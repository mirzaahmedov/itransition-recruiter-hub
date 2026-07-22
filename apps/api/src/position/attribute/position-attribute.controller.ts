import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PositionAttributeService } from './position-attribute.service';
import { CreatePositionAttributeDto } from './dto/create-position-attribute.dto';
import { UpdatePositionAttributeDto } from './dto/update-position-attribute.dto';

@Controller('position-attribute')
export class PositionAttributeController {
  constructor(
    private readonly positionAttributeService: PositionAttributeService,
  ) {}

  @Post()
  create(@Body() createPositionAttributeDto: CreatePositionAttributeDto) {
    return this.positionAttributeService.create(createPositionAttributeDto);
  }

  @Get()
  findAll() {
    return this.positionAttributeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.positionAttributeService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePositionAttributeDto: UpdatePositionAttributeDto,
  ) {
    return this.positionAttributeService.update(
      +id,
      updatePositionAttributeDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.positionAttributeService.remove(+id);
  }
}

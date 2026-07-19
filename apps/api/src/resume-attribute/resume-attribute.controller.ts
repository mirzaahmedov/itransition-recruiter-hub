import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ResumeAttributeService } from './resume-attribute.service';
import { CreateResumeAttributeDto } from './dto/create-resume-attribute.dto';
import { UpdateResumeAttributeDto } from './dto/update-resume-attribute.dto';

@Controller('resume-attribute')
export class ResumeAttributeController {
  constructor(private readonly resumeAttributeService: ResumeAttributeService) {}

  @Post()
  create(@Body() createResumeAttributeDto: CreateResumeAttributeDto) {
    return this.resumeAttributeService.create(createResumeAttributeDto);
  }

  @Get()
  findAll() {
    return this.resumeAttributeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.resumeAttributeService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateResumeAttributeDto: UpdateResumeAttributeDto) {
    return this.resumeAttributeService.update(+id, updateResumeAttributeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.resumeAttributeService.remove(+id);
  }
}

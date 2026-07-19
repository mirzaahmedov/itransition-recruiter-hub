import { Injectable } from '@nestjs/common';
import { CreateResumeAttributeDto } from './dto/create-resume-attribute.dto';
import { UpdateResumeAttributeDto } from './dto/update-resume-attribute.dto';

@Injectable()
export class ResumeAttributeService {
  create(createResumeAttributeDto: CreateResumeAttributeDto) {
    return 'This action adds a new resumeAttribute';
  }

  findAll() {
    return `This action returns all resumeAttribute`;
  }

  findOne(id: number) {
    return `This action returns a #${id} resumeAttribute`;
  }

  update(id: number, updateResumeAttributeDto: UpdateResumeAttributeDto) {
    return `This action updates a #${id} resumeAttribute`;
  }

  remove(id: number) {
    return `This action removes a #${id} resumeAttribute`;
  }
}

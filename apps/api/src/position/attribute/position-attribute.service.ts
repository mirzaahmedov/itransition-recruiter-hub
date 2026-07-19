import { Injectable } from '@nestjs/common';
import { CreatePositionAttributeDto } from './dto/create-position-attribute.dto';
import { UpdatePositionAttributeDto } from './dto/update-position-attribute.dto';

@Injectable()
export class PositionAttributeService {
  create(createPositionAttributeDto: CreatePositionAttributeDto) {
    return 'This action adds a new positionAttribute';
  }

  findAll() {
    return `This action returns all positionAttribute`;
  }

  findOne(id: number) {
    return `This action returns a #${id} positionAttribute`;
  }

  update(id: number, updatePositionAttributeDto: UpdatePositionAttributeDto) {
    return `This action updates a #${id} positionAttribute`;
  }

  remove(id: number) {
    return `This action removes a #${id} positionAttribute`;
  }
}

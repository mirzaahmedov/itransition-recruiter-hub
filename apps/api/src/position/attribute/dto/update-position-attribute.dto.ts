import { PartialType } from '@nestjs/mapped-types';
import { CreatePositionAttributeDto } from './create-position-attribute.dto';

export class UpdatePositionAttributeDto extends PartialType(
  CreatePositionAttributeDto,
) {}

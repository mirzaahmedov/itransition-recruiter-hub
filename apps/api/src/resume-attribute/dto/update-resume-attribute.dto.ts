import { PartialType } from '@nestjs/mapped-types';
import { CreateResumeAttributeDto } from './create-resume-attribute.dto';

export class UpdateResumeAttributeDto extends PartialType(
  CreateResumeAttributeDto,
) {}

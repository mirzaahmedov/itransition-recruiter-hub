import { PartialType } from '@nestjs/mapped-types';
import { CreateAttributeChoiceDto } from './create-attribute-choice.dto';

export class UpdateAttributeChoiceDto extends PartialType(CreateAttributeChoiceDto) {}

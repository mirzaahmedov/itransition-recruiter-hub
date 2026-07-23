import { createZodDto } from 'nestjs-zod';
import {
  AddAttributeChoiceSchema,
  BulkIdsSchema,
  CreateAttributeSchema,
  RenameAttributeChoiceSchema,
  UpdateAttributeSchema,
} from '@rh/shared/schemas';

export class CreateAttributeDto extends createZodDto(CreateAttributeSchema) {}
export class UpdateAttributeDto extends createZodDto(UpdateAttributeSchema) {}
export class BulkDeleteAttributesDto extends createZodDto(BulkIdsSchema) {}
export class AddAttributeChoiceDto extends createZodDto(
  AddAttributeChoiceSchema,
) {}
export class RenameAttributeChoiceDto extends createZodDto(
  RenameAttributeChoiceSchema,
) {}

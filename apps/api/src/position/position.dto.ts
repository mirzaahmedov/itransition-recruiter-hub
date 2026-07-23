import { createZodDto } from 'nestjs-zod';
import {
  BulkIdsSchema,
  CreatePositionSchema,
  UpdatePositionSchema,
} from '@rh/shared';
import { UpdatePositionStatusSchema } from '@rh/shared/schemas';

export class CreatePositionDto extends createZodDto(CreatePositionSchema) {}
export class UpdatePositionDto extends createZodDto(UpdatePositionSchema) {}
export class UpdatePositionStatusDto extends createZodDto(
  UpdatePositionStatusSchema,
) {}
export class BulkCreatePositionAttributesDto extends createZodDto(
  BulkIdsSchema,
) {}

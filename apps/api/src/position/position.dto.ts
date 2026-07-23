import { createZodDto } from 'nestjs-zod';
import {
  BulkIdsSchema,
  CreatePositionSchema,
  UpdatePositionSchema,
} from '@rh/shared';

export class CreatePositionDto extends createZodDto(CreatePositionSchema) {}
export class UpdatePositionDto extends createZodDto(UpdatePositionSchema) {}
export class BulkCreatePositionAttributesDto extends createZodDto(
  BulkIdsSchema,
) {}

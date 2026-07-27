import { createZodDto } from 'nestjs-zod';
import {
  BulkIdsSchema,
  CreatePositionSchema,
  UpdatePositionSchema,
  FindAllPositionParamsSchema,
} from '@rh/shared/schemas';
import { UpdatePositionStatusSchema } from '@rh/shared/schemas';

export class CreatePositionDto extends createZodDto(CreatePositionSchema) {}
export class UpdatePositionDto extends createZodDto(UpdatePositionSchema) {}
export class UpdatePositionStatusDto extends createZodDto(
  UpdatePositionStatusSchema,
) {}
export class BulkCreatePositionAttributesDto extends createZodDto(
  BulkIdsSchema,
) {}

export class FindAllPositionParamsDto extends createZodDto(
  FindAllPositionParamsSchema,
) {}

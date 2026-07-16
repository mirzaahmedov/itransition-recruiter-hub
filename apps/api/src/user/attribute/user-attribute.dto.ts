import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import {
  BulkIdsSchema,
  BulkUpdateUserAttributesSchema,
  ProfileAttributeCreateSchema,
  ProfileAttributeUpdateSchema,
} from '@rh/shared/schemas';

export class ProfileAttributeCreateDto extends createZodDto(
  ProfileAttributeCreateSchema,
) {}
export class ProfileAttributeUpdateDto extends createZodDto(
  ProfileAttributeUpdateSchema,
) {}
export class ProfileAttributeCreateBulkDto extends createZodDto(
  BulkIdsSchema,
) {}
export class BulkUpdateUserAttributesDto extends createZodDto(
  BulkUpdateUserAttributesSchema,
) {}

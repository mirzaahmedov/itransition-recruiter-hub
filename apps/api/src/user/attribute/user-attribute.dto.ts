import { createZodDto } from 'nestjs-zod';
import {
  BulkIdsSchema,
  BulkUpdateUserProfileAttributeSchema,
  CreateUserProfileAttributeSchema,
  UpdateUserProfileAttributeSchema,
} from '@rh/shared/schemas';

export class CreateUserProfileAttributeDto extends createZodDto(
  CreateUserProfileAttributeSchema,
) {}
export class UpdateUserProfileAttributeDto extends createZodDto(
  UpdateUserProfileAttributeSchema,
) {}
export class BulkCreateUserProfileAttributeDto extends createZodDto(
  BulkIdsSchema,
) {}
export class BulkUpdateUserProfileAttributeDto extends createZodDto(
  BulkUpdateUserProfileAttributeSchema,
) {}

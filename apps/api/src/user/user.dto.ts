import {
  BulkUpdateUserRolesSchema,
  UpdateUserProfileSchema,
} from '@rh/shared/schemas';
import { createZodDto } from 'nestjs-zod';

export class BulkUpdateUserRolesDto extends createZodDto(
  BulkUpdateUserRolesSchema,
) {}

export class UpdateUserProfileDto extends createZodDto(
  UpdateUserProfileSchema,
) {}

import { UserBulkUpdateRolesSchema } from '@rh/shared/schemas';
import { createZodDto } from 'nestjs-zod';

export class UserBulkUpdateRolesDto extends createZodDto(
  UserBulkUpdateRolesSchema,
) {}

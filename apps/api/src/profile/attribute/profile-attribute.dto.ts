import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import {
  ProfileAttributeCreateSchema,
  ProfileAttributeUpdateSchema,
} from '@rh/shared/schemas';

export class ProfileAttributeCreateDto extends createZodDto(
  ProfileAttributeCreateSchema,
) {}
export class ProfileAttributeUpdateDto extends createZodDto(
  ProfileAttributeUpdateSchema,
) {}

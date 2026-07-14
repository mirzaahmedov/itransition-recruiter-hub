import { AttributeCreateSchema, AttributeRenameSchema } from '@rh/shared';
import { createZodDto } from 'nestjs-zod';

export class AttributeCreateDto extends createZodDto(AttributeCreateSchema) {}
export class AttributeUpdateDto extends createZodDto(AttributeRenameSchema) {}

import { createZodDto } from 'nestjs-zod';
import { CreateAttributeSchema, UpdateAttributeSchema } from '@rh/shared';

export class CreateAttributeDto extends createZodDto(CreateAttributeSchema) {}
export class UpdateAttributeDto extends createZodDto(UpdateAttributeSchema) {}

import { createZodDto } from 'nestjs-zod';
import { CreatePositionSchema, UpdatePositionSchema } from '@rh/shared';

export class CreatePositionDto extends createZodDto(CreatePositionSchema) {}
export class UpdatePositionDto extends createZodDto(UpdatePositionSchema) {}

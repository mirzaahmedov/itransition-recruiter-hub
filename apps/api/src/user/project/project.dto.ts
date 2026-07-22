import { createZodDto } from 'nestjs-zod';
import { CreateProjectSchema, UpdateProjectSchema } from '@rh/shared/schemas';

export class CreateProjectDto extends createZodDto(CreateProjectSchema) {}
export class UpdateProjectDto extends createZodDto(UpdateProjectSchema) {}

import { createZodDto } from 'nestjs-zod';
import { CreateResumeSchema } from '@rh/shared/schemas';

export class CreateResumeDto extends createZodDto(CreateResumeSchema) {}

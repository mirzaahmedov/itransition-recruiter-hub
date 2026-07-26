import { createZodDto } from 'nestjs-zod';
import { PartialType } from '@nestjs/mapped-types';
import { CreateResumeSchema } from '@rh/shared/schemas';

export class CreateResumeDto extends createZodDto(CreateResumeSchema) {}
export class UpdateResumeDto extends PartialType(CreateResumeDto) {}

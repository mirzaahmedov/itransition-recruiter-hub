import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import { PositionCreateSchema } from '@rh/shared';

export class PositionCreateDto extends createZodDto(PositionCreateSchema) {}

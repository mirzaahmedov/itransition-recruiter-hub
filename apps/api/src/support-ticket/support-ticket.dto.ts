import { createZodDto } from 'nestjs-zod';
import {
  CreateSupportTicketSchema,
  SupportTicketFileContentsSchema,
} from '@rh/shared/schemas';

export class CreateSupportTicketDto extends createZodDto(
  CreateSupportTicketSchema,
) {}
export class SupportTicketFileContentsDto extends createZodDto(
  SupportTicketFileContentsSchema,
) {}

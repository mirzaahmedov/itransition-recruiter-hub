import { CreateSalesforceSchema } from '@rh/shared/schemas';
import { createZodDto } from 'nestjs-zod';

export class CreateSalesforceDto extends createZodDto(CreateSalesforceSchema) {}

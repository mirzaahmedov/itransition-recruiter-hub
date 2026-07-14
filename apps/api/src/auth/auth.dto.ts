import { UserLoginSchema, UserRegisterSchema } from '@rh/shared';
import { createZodDto } from 'nestjs-zod';

export class UserRegisterDto extends createZodDto(UserRegisterSchema) {}
export class UserLoginDto extends createZodDto(UserLoginSchema) {}

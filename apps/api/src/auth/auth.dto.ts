import { LoginUserSchema, RegisterUserSchema } from '@rh/shared';
import { createZodDto } from 'nestjs-zod';

export class RegisterUserDto extends createZodDto(RegisterUserSchema) {}
export class LoginUserDto extends createZodDto(LoginUserSchema) {}

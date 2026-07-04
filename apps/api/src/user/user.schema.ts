import { UserRole } from '@rh/core';
import z from 'zod';

export const UserUpdateRoleSchema = z.object({
  role: z.enum([
    UserRole.ADMINISTRATOR,
    UserRole.CANDIDATE,
    UserRole.RECRUITER,
  ]),
});

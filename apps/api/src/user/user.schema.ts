import { UserRole } from '@rh/database/enums';
import z from 'zod';

export const UserUpdateRoleSchema = z.object({
  role: z.enum([
    UserRole.ADMINISTRATOR,
    UserRole.CANDIDATE,
    UserRole.RECRUITER,
  ]),
});

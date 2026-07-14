import { UserRole } from "@rh/database/enums";
import { z } from "zod";
import { BulkIdsSchema } from "./BulkIdsSchema.js";

export const UserBulkUpdateRolesSchema = z
  .object({
    role: z.enum([UserRole.ADMINISTRATOR, UserRole.CANDIDATE, UserRole.RECRUITER]),
  })
  .extend(BulkIdsSchema.shape);

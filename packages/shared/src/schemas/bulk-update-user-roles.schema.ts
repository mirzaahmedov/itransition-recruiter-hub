import { UserRole } from "@rh/database/enums";
import { z } from "zod";
import { BulkIdsSchema } from "./bulk-ids.schema.js";

export const BulkUpdateUserRolesSchema = z
  .object({
    role: z.enum([UserRole.ADMINISTRATOR, UserRole.CANDIDATE, UserRole.RECRUITER]),
  })
  .extend(BulkIdsSchema.shape);

import { z } from "zod";
import { BulkIdsSchema } from "./BulkIdsSchema.js";

export const ProfileAttributeCreateBulkSchema = z.object({}).extend(BulkIdsSchema.shape);
export type ProfileAttributeCreateBulkPayload = z.infer<typeof ProfileAttributeCreateBulkSchema>;

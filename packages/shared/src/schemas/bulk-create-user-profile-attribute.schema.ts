import { z } from "zod";
import { BulkIdsSchema } from "./bulk-ids.schema.js";

export const BulkCreateUserProfileAttributeSchema = z.object({}).extend(BulkIdsSchema.shape);
export type BulkCreateUserProfileAttributePayload = z.infer<typeof BulkCreateUserProfileAttributeSchema>;

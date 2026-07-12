import { z } from "zod";

export const ProfileAttributeCreateSchema = z.object({
  attrId: z.string(),
});
export type ProfileAttributeCreatePayload = z.infer<typeof ProfileAttributeCreateSchema>;

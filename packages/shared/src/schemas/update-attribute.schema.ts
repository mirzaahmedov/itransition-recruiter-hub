import { z } from "zod";

export const UpdateAttributeSchema = z.object({
  name: z.string(),
});

export type UpdateAttributePayload = z.infer<typeof UpdateAttributeSchema>;

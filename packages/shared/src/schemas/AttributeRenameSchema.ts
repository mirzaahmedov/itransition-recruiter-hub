import { z } from "zod";

export const AttributeRenameSchema = z.object({
  name: z.string(),
});

export type AttributeRenamePayload = z.infer<typeof AttributeRenameSchema>;

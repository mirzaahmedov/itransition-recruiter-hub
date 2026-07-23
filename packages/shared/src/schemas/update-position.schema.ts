import { z } from "zod";

export const UpdatePositionSchema = z.object({
  title: z.string().nonempty().optional(),
  description: z.string().nonempty().optional(),
});
export type UpdatePositionPayload = z.infer<typeof UpdatePositionSchema>;

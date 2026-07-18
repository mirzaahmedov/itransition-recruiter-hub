import { z } from "zod";

export const UpdatePositionSchema = z.object({
  title: z.string().nonempty().optional(),
  description: z.string().nonempty().optional(),
  attributes: z.array(z.object({ id: z.string() })).optional(),
});
export type UpdatePositionPayload = z.infer<typeof UpdatePositionSchema>;

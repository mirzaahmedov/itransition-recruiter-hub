import { z } from "zod";

export const UpdateUserProfileSchema = z.object({
  name: z.string().min(1).optional(),
});
export type UpdateUserProfilePayload = z.infer<typeof UpdateUserProfileSchema>;

import { z } from "zod";

export const CreateResumeSchema = z.object({
  userId: z.string(),
  positionId: z.string(),
});
export type CreateResumePayload = z.infer<typeof CreateResumeSchema>;

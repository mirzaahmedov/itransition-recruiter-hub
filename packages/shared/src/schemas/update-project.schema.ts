import { z } from "zod";

export const UpdateProjectSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  url: z.string().url().optional().nullable(),
  image: z.string().optional().nullable(),
});

export type UpdateProjectPayload = z.infer<typeof UpdateProjectSchema>;

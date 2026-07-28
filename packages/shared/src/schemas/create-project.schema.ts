import { z } from "zod";

export const CreateProjectSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  url: z.url().optional().nullable(),
});

export type CreateProjectPayload = z.infer<typeof CreateProjectSchema>;

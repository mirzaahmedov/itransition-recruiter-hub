import { z } from "zod";

export const CreateProjectSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  url: z.string().url().optional().nullable(),
  image: z.string().optional().nullable(),
});

export type CreateProjectPayload = z.infer<typeof CreateProjectSchema>;

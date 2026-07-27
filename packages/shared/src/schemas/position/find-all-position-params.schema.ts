import { z } from "zod";

export const FindAllPositionParamsSchema = z.object({
  search: z.string().optional(),
  sortBy: z.enum(["title", "resumes", "createdAt"]).optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
});
export type FindAllPositionParamsPayload = z.infer<typeof FindAllPositionParamsSchema>;

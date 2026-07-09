import { z } from "zod";

export const PositionCreateSchema = z.object({
  title: z.string().nonempty(),
  description: z.string().nonempty(),

  attributes: z.array(
    z.object({
      id: z.string(),
    }),
  ),
});
export type PositionCreatePayload = z.infer<typeof PositionCreateSchema>;

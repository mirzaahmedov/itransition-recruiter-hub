import { z } from "zod";

export const CreateSupportTicketSchema = z.object({
  title: z.string().nonempty(),
  link: z.string().nonempty(),
  positionId: z.string().optional(),
  priority: z.enum(["HIGH", "AVERAGE", "LOW"]),
});
export type CreateSupportTicketPayload = z.infer<typeof CreateSupportTicketSchema>;

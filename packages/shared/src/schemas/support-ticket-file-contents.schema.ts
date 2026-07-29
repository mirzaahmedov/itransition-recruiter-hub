import { UserRole } from "@rh/database/enums";
import { z } from "zod";

export const SupportTicketFileContentsSchema = z.object({
  userId: z.string(),
  userRole: z.enum([UserRole.ADMINISTRATOR, UserRole.CANDIDATE, UserRole.RECRUITER]),
  title: z.string().nonempty(),
  link: z.string().nonempty(),
  positionId: z.string().optional(),
  priority: z.enum(["HIGH", "AVERAGE", "LOW"]),
  emails: z.array(z.email()),
});
export type SupportTicketFileContentsPayload = z.infer<typeof SupportTicketFileContentsSchema>;

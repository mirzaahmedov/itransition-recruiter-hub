import { PositionStatus } from "@rh/database/enums";
import { z } from "zod";

export const UpdatePositionStatusSchema = z.object({
  status: z.enum([PositionStatus.ACTIVE, PositionStatus.ARCHIVED]),
});
export type UpdatePositionStatusPayload = z.infer<typeof UpdatePositionStatusSchema>;

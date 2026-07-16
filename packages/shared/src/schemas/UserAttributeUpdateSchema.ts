import { z } from "zod";

export const ProfileAttributeUpdateSchema = z.object({
  textValue: z.string().optional(),
  numberValue: z.number().optional(),
  booleanValue: z.boolean().optional(),
  dateValue: z.date().optional(),
  startDateValue: z.date().optional(),
  endDateValue: z.date().optional(),
  choiceId: z.string().optional(),
});
export type ProfileAttributeUpdatePayload = z.infer<typeof ProfileAttributeUpdateSchema>;

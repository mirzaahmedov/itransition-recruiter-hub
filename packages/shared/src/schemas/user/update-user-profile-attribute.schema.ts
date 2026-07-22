import { z } from "zod";

export const UpdateUserProfileAttributeSchema = z.object({
  textValue: z.string().optional(),
  numberValue: z.number().optional(),
  booleanValue: z.boolean().optional(),
  dateValue: z.date().optional(),
  startDateValue: z.date().optional(),
  endDateValue: z.date().optional(),
  choiceId: z.string().optional(),
});
export type UpdateUserProfileAttributePayload = z.infer<typeof UpdateUserProfileAttributeSchema>;

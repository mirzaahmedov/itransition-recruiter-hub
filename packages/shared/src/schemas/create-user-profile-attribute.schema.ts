import { z } from "zod";

export const CreateUserProfileAttributeSchema = z.object({
  attributeId: z.string(),

  textValue: z.string().optional(),
  numberValue: z.number().optional(),
  booleanValue: z.boolean().optional(),
  dateValue: z.date().optional(),
  startDateValue: z.date().optional(),
  endDateValue: z.date().optional(),

  choiceId: z.string().optional(),
  profileId: z.string(),
});
export type CreateUserProfileAttributePayload = z.infer<typeof CreateUserProfileAttributeSchema>;

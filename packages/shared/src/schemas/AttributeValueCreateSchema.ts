import { z } from "zod";

export const AttributeValueCreateSchema = z.object({
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
export type AttributeValueCreatePayload = z.infer<typeof AttributeValueCreateSchema>;

import { z } from "zod";

export const BulkUpdateUserProfileAttributeSchema = z.array(
  z.object({
    id: z.string(),
    version: z.number(),
    data: z.object({
      textValue: z.string().optional(),
      numberValue: z.number().optional(),
      booleanValue: z.boolean().optional(),
      dateValue: z.coerce.date().optional(),
      startDateValue: z.coerce.date().optional(),
      endDateValue: z.coerce.date().optional(),
      choiceId: z.string().optional(),
    }),
  }),
);

export type BulkUpdateUserProfileAttributePayload = z.infer<typeof BulkUpdateUserProfileAttributeSchema>;

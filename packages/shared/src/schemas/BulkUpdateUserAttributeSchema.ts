import { z } from "zod";

export const BulkUpdateUserAttributesSchema = z.array(
  z.object({
    id: z.string(),
    version: z.number(),
    data: z.object({
      textValue: z.string().optional(),
      numberValue: z.number().optional(),
      booleanValue: z.boolean().optional(),
      dateValue: z.date().optional(),
      startDateValue: z.date().optional(),
      endDateValue: z.date().optional(),
      choiceId: z.string().optional(),
    }),
  }),
);

export type BulkUpdateUserAttributesPayload = z.infer<typeof BulkUpdateUserAttributesSchema>;

import { AttributeType } from "@rh/database/enums";
import { z } from "zod";
import { ZodIssueCode } from "zod/v3";

export const CreateAttributeSchema = z
  .object({
    name: z.string().nonempty("Required field"),
    type: z.enum([
      AttributeType.TEXT,
      AttributeType.MARKDOWN,
      AttributeType.NUMERIC,
      AttributeType.BOOLEAN,
      AttributeType.IMAGE,
      AttributeType.DATE,
      AttributeType.DATEPERIOD,
      AttributeType.CHOICE,
    ]),
    categoryId: z.string().nonempty("Required field"),
    choices: z
      .array(
        z.object({
          value: z.string(),
        }),
      )
      .default([]),
  })
  .superRefine((values, ctx) => {
    if (values.type === AttributeType.CHOICE && !values.choices.length) {
      ctx.addIssue({
        code: ZodIssueCode.custom,
        path: ["choices"],
        message: "required",
      });
    }
  });

export type CreateAttributePayload = z.infer<typeof CreateAttributeSchema>;

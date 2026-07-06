import { AttributeType } from "@rh/database/enums";
import z from "zod";
import { ZodIssueCode } from "zod/v3";

export const AttributeCreateSchema = z
  .object({
    name: z.string(),
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

export type AttributeCreatePayload = z.infer<typeof AttributeCreateSchema>;

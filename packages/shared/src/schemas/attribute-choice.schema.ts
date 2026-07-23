import { z } from "zod";

export const AddAttributeChoiceSchema = z.object({
  value: z.string().nonempty("Required field"),
});

export type AddAttributeChoicePayload = z.infer<typeof AddAttributeChoiceSchema>;

export const RenameAttributeChoiceSchema = z.object({
  value: z.string().nonempty("Required field"),
});

export type RenameAttributeChoicePayload = z.infer<typeof RenameAttributeChoiceSchema>;

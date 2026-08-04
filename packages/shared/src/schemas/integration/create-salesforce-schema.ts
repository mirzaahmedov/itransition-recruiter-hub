import { z } from "zod";

export const CreateSalesforceSchema = z.object({
  firstName: z.string().nonempty("Required field"),
  lastName: z.string().nonempty("Required field"),
  email: z.email().nonempty("Required field"),
  phone: z.string().nonempty("Required field"),
  title: z.string().optional(),
});
export type CreateSalesforcePayload = z.infer<typeof CreateSalesforceSchema>;

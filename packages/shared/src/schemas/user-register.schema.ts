import { z } from "zod";

export const UserRegisterSchema = z.object({
  name: z.string(),
  email: z.email(),
  password: z.string(),
});
export type UserRegisterPayload = z.infer<typeof UserRegisterSchema>;

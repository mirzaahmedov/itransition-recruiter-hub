import { z } from "zod";

export const UserRegisterSchema = z.object({
  name: z.string(),
  email: z.email(),
  password: z.string().min(6),
});
export type UserRegisterPayload = z.infer<typeof UserRegisterSchema>;

import { z } from "zod";

export const UserLoginSchema = z.object({
  email: z.email(),
  password: z.string().min(6),
});
export type UserLoginPayload = z.infer<typeof UserLoginSchema>;

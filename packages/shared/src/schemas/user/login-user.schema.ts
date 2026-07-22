import { z } from "zod";

export const LoginUserSchema = z.object({
  email: z.email(),
  password: z.string().min(6, "Password too weak must be at least 6 characters"),
});
export type LoginUserPayload = z.infer<typeof LoginUserSchema>;

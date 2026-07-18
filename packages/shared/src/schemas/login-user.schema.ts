import { z } from "zod";

export const LoginUserSchema = z.object({
  email: z.email(),
  password: z.string().min(6),
});
export type LoginUserPayload = z.infer<typeof LoginUserSchema>;

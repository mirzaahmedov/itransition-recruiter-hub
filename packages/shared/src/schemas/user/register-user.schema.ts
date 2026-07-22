import { z } from "zod";

export const RegisterUserSchema = z.object({
  name: z.string().nonempty("Required field"),
  email: z.email(),
  password: z.string().min(6, "Password too weak must be at least 6 characters"),
});
export type RegisterUserPayload = z.infer<typeof RegisterUserSchema>;

import z from "zod";

export const UserCreateSchema = z.object({
  email: z.email(),
  password: z.string(),
});
export type UserCreatePayload = z.infer<typeof UserCreateSchema>;

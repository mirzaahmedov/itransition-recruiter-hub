import { publicApi } from "@/lib/api/client";
import type { ApiResponse } from "@/models/api";
import type { User } from "@rh/database/browser";
import type { LoginUserPayload, RegisterUserPayload } from "@rh/shared/schemas";

interface AuthResponse {
  accessToken: string;
  user: User;
}

export async function login(data: LoginUserPayload) {
  const res = await publicApi.post<ApiResponse<AuthResponse>>("/auth/login", data);
  return res.data;
}

export async function register(data: RegisterUserPayload) {
  const res = await publicApi.post<ApiResponse<AuthResponse>>("/auth/register", data);
  return res.data;
}

export async function loginGoogle() {
  const res = await publicApi.get("/auth/google");
  return res.data;
}

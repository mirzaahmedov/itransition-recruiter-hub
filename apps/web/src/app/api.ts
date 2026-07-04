import { privateApi } from "@/lib/api/client";
import type { ApiResponse } from "@/models/api";
import type { User } from "@/types/prisma/browser";

export async function fetchUserProfile() {
  const res = await privateApi.get<ApiResponse<User>>("/auth/me");
  return res.data;
}

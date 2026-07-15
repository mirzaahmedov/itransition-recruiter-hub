import { privateApi } from "@/lib/api/client";
import type { ApiResponse } from "@/models/api";
import type { User } from "@rh/database/browser";

export async function fetchMe() {
  const res = await privateApi.get<ApiResponse<User>>("/auth/me");
  return res.data;
}

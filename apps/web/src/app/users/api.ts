import { privateApi } from "@/lib/api/client";
import type { ApiResponse } from "@/models/api";
import type { User, UserRole } from "@rh/database/browser";

export async function fetchUsers() {
  const res = await privateApi.get<ApiResponse<User[]>>("/users");
  return res.data;
}

export async function bulkUpdateRoles(ids: string[], role: UserRole) {
  const res = await privateApi.patch<ApiResponse<User[]>>("/users/bulk-change-roles", {
    ids,
    role,
  });
  return res.data;
}

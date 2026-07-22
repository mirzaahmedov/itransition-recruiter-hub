import { privateApi } from "@/lib/api/client";
import type { ApiResponse } from "@/models/api";
import type { PaginatedResponse } from "@rh/shared/models";
import type { User, UserRole } from "@rh/database/browser";

export async function fetchUsers(params: { search: string; pageIndex: number; pageSize: number }) {
  const res = await privateApi.get<PaginatedResponse<User[]>>("/users", {
    params,
  });
  return res.data;
}

export async function bulkUpdateRoles(ids: string[], role: UserRole) {
  const res = await privateApi.patch<ApiResponse<User[]>>("/users/bulk-change-roles", {
    ids,
    role,
  });
  return res.data;
}

export async function bulkDeleteUsers(ids: string[]) {
  const res = await privateApi.delete<ApiResponse<{ deleted: number }>>("/users/bulk", {
    data: { ids },
  });
  return res.data;
}

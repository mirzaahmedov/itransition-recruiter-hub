import { privateApi } from "@/lib/api/client";
import type { ApiResponse } from "@rh/shared/models";
import type { Category } from "@rh/database/browser";

export async function fetchCategories() {
  const res = await privateApi.get<ApiResponse<Category[]>>("/categories");
  return res.data;
}

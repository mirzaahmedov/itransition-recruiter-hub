import { privateApi } from "@/lib/api/client";
import type { Category } from "@rh/database/browser";

export async function fetchCategories() {
  const res = await privateApi.get<Category[]>("/categories");
  return res.data;
}

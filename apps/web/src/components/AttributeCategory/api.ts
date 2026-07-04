import { privateApi } from "@/lib/api/client";
import type { ApiResponse } from "@/models/api";
import type { AttributeCategory } from "@/types/prisma/browser";
import type { AttributeCategoryCreateInput, AttributeCategoryUpdateInput } from "@/types/prisma/models";

export async function fetchCategories() {
  const res = await privateApi.get<ApiResponse<AttributeCategory[]>>("/attribute-categories");
  return res.data;
}

export async function createCategory(payload: AttributeCategoryCreateInput) {
  const res = await privateApi.post<ApiResponse<AttributeCategory>>("/attribute-categories", payload);
  return res.data;
}

export async function updateCategory(id: string, payload: AttributeCategoryUpdateInput) {
  const res = await privateApi.post<ApiResponse<AttributeCategory>>(`/attribute-categories/${id}`, payload);
  return res.data;
}

export async function deleteCategory(id: string) {
  const res = await privateApi.delete<ApiResponse<AttributeCategory>>(`/attribute-categories/${id}`);
  return res.data;
}

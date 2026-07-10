import { privateApi } from "@/lib/api/client";

export async function fetchCategories() {
  const res = await privateApi.get<>("/categories");
  return res.data;
}

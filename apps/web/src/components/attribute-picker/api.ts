import { privateApi } from "@/lib/api/client";
import type { ApiResponse } from "@/models/api";
import type { Attribute } from "@rh/database/browser";

interface SearchAttributeArgs {
  q: string;
  categoryId?: string;
}
export async function fetchSearchAttributes({ q, categoryId }: SearchAttributeArgs) {
  const res = await privateApi.get<ApiResponse<Attribute[]>>("/attributes/search", {
    params: {
      q,
      categoryId,
    },
  });
  return res.data;
}

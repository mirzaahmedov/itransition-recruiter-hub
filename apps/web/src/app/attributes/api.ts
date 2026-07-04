import { privateApi } from "@/lib/api/client";
import type { ApiResponse } from "@/models/api";
import type { Attribute } from "@/types/prisma/browser";
import type { AttributeCreateInput } from "@/types/prisma/models";

export async function fetchAttributes(categoryId: string) {
  const res = await privateApi.get<ApiResponse<Attribute[]>>("/attributes", {
    params: {
      categoryId,
    },
  });
  return res.data;
}
export async function createAttribute(payload: AttributeCreateInput) {
  const res = await privateApi.post<ApiResponse<Attribute>>("/attributes", payload);
  return res.data;
}

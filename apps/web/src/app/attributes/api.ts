import { privateApi } from "@/lib/api/client";
import type { ApiResponse } from "@/models/api";
import type { Attribute } from "@/types/prisma/browser";
import type { AttributeGetPayload } from "@/types/prisma/models";
import type { AttributeCreatePayload } from "@rh/shared";

export async function fetchAttributes(categoryId?: string) {
  const res = await privateApi.get<
    ApiResponse<
      AttributeGetPayload<{
        include: {
          choices: true;
        };
      }>[]
    >
  >("/attributes", {
    params: {
      categoryId,
    },
  });
  return res.data;
}
export async function createAttribute(payload: AttributeCreatePayload) {
  const res = await privateApi.post<ApiResponse<Attribute>>("/attributes", payload);
  return res.data;
}

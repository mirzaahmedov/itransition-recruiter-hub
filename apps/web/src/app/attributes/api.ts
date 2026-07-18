import { privateApi } from "@/lib/api/client";
import type { ApiResponse } from "@/models/api";
import type { Attribute } from "@/types/prisma/browser";
import type { AttributeGetPayload } from "@/types/prisma/models";
import type { CreateAttributePayload } from "@rh/shared";

export type AttributeWithChoices = AttributeGetPayload<{
  include: {
    choices: true;
  };
}>;

export async function fetchAttributes(categoryId?: string) {
  const res = await privateApi.get<ApiResponse<AttributeWithChoices[]>>("/attributes", {
    params: {
      categoryId,
    },
  });
  return res.data;
}
export async function createAttribute(payload: CreateAttributePayload) {
  const res = await privateApi.post<ApiResponse<Attribute>>("/attributes", payload);
  return res.data;
}

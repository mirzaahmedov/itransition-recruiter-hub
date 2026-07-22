import { privateApi } from "@/lib/api/client";
import type { ApiResponse } from "@/models/api";
import type { Attribute } from "@rh/database/browser";
import type { AttributeGetPayload } from "@rh/database/models";
import type { CreateAttributePayload, UpdateAttributePayload } from "@rh/shared";

export type AttributeWithChoices = AttributeGetPayload<{
  include: {
    choices: true;
  };
}>;

export type AttributeWithUsage = AttributeGetPayload<{
  include: {
    choices: true;
    category: true;
    _count: {
      select: {
        values: true;
        positionAttributes: true;
      };
    };
  };
}>;

export async function fetchAttributes(categoryId?: string) {
  const res = await privateApi.get<ApiResponse<AttributeWithUsage[]>>("/attributes", {
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

export async function renameAttribute(id: string, payload: UpdateAttributePayload) {
  const res = await privateApi.patch<ApiResponse<Attribute>>(`/attributes/${id}/rename`, payload);
  return res.data;
}

export async function deleteAttribute(id: string) {
  const res = await privateApi.delete<ApiResponse<Attribute>>(`/attributes/${id}`);
  return res.data;
}

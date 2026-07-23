import { privateApi } from "@/lib/api/client";
import type { ApiResponse } from "@/models/api";
import type { Attribute } from "@rh/database/browser";
import type { AttributeGetPayload } from "@rh/database/models";
import type { AddAttributeChoicePayload, CreateAttributePayload, RenameAttributeChoicePayload, UpdateAttributePayload } from "@rh/shared";
import type { PaginatedResponse } from "@rh/shared/models";

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

export type AttributeDetail = AttributeGetPayload<{
  include: {
    choices: {
      include: {
        _count: {
          select: {
            values: true;
          };
        };
      };
    };
    category: true;
    _count: {
      select: {
        values: true;
        positionAttributes: true;
      };
    };
  };
}>;

export async function fetchAttributes(params: { categoryId?: string; search: string; pageIndex: number; pageSize: number }) {
  const res = await privateApi.get<PaginatedResponse<AttributeWithUsage[]>>("/attributes", {
    params,
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

export async function bulkDeleteAttributes(ids: string[]) {
  const res = await privateApi.delete<ApiResponse<{ deleted: number }>>("/attributes/bulk", {
    data: { ids },
  });
  return res.data;
}

export async function addAttributeChoice(attributeId: string, payload: AddAttributeChoicePayload) {
  const res = await privateApi.post<ApiResponse<Attribute>>(`/attributes/${attributeId}/choices`, payload);
  return res.data;
}

export async function renameAttributeChoice(attributeId: string, choiceId: string, payload: RenameAttributeChoicePayload) {
  const res = await privateApi.patch<ApiResponse<Attribute>>(`/attributes/${attributeId}/choices/${choiceId}`, payload);
  return res.data;
}

export async function removeAttributeChoice(attributeId: string, choiceId: string) {
  const res = await privateApi.delete<ApiResponse<{ success: boolean }>>(`/attributes/${attributeId}/choices/${choiceId}`);
  return res.data;
}

export async function fetchAttributeDetail(id: string) {
  const res = await privateApi.get<ApiResponse<AttributeDetail>>(`/attributes/${id}`);
  return res.data.data;
}

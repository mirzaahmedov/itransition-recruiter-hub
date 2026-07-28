import { privateApi } from "@/lib/api/client";
import type { ApiResponse } from "@rh/shared/models";
import type { PositionStatus, Resume } from "@rh/database/browser";
import type { PositionGetPayload } from "@rh/database/models";
import type { CreatePositionPayload, UpdatePositionPayload, FindAllPositionParamsPayload } from "@rh/shared/schemas";

export type SortBy = FindAllPositionParamsPayload["sortBy"];
export type SortOrder = FindAllPositionParamsPayload["sortOrder"];

export type PositionWithAttributes = PositionGetPayload<{
  include: {
    resumes: true;
    attributes: {
      include: {
        attribute: true;
      };
    };
  };
}>;

export type PositionAttributeItem = PositionWithAttributes["attributes"][number];

export async function fetchPositions(search: string, sortBy: SortBy, sortOrder: SortOrder) {
  const res = await privateApi.get<ApiResponse<PositionWithAttributes[]>>("/positions", {
    params: {
      search,
      sortBy,
      sortOrder,
    },
  });
  return res.data;
}

export async function fetchPosition(id: string) {
  const res = await privateApi.get<ApiResponse<PositionWithAttributes>>(`/positions/${id}`);
  return res.data;
}

export async function createPosition(payload: CreatePositionPayload) {
  const res = await privateApi.post<ApiResponse<PositionWithAttributes>>("/positions", payload);
  return res.data;
}

export async function updatePosition(id: string, payload: UpdatePositionPayload) {
  const res = await privateApi.patch<ApiResponse<PositionWithAttributes>>(`/positions/${id}`, payload);
  return res.data;
}

export async function updatePositionStatus(id: string, status: PositionStatus) {
  const res = await privateApi.patch<ApiResponse<PositionWithAttributes>>(`/positions/${id}/status`, {
    status,
  });
  return res.data;
}

export async function deletePosition(id: string) {
  const res = await privateApi.delete<ApiResponse<PositionWithAttributes>>(`/positions/${id}`);
  return res.data;
}

export async function bulkAddPositionAttributes(positionId: string, ids: string[]) {
  const res = await privateApi.post<ApiResponse<PositionWithAttributes>>(`/positions/${positionId}/attributes/bulk-create`, { ids });
  return res.data;
}

export async function removePositionAttribute(positionId: string, attributeId: string) {
  const res = await privateApi.delete<ApiResponse<PositionWithAttributes>>(`/positions/${positionId}/attributes/${attributeId}`);
  return res.data;
}

export async function genResumePosition(positionId: string) {
  const res = await privateApi.post<ApiResponse<Resume>>(`/positions/${positionId}/resumes`);
  return res.data;
}

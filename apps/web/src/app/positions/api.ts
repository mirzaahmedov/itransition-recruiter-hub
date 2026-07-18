import { privateApi } from "@/lib/api/client";
import type { ApiResponse } from "@/models/api";
import type { PositionGetPayload } from "@rh/database/models";
import type { CreatePositionPayload, UpdatePositionPayload } from "@rh/shared";

export type PositionWithAttributes = PositionGetPayload<{
  include: {
    attributes: {
      include: {
        attribute: true;
      };
    };
  };
}>;

export type PositionAttributeItem = PositionWithAttributes["attributes"][number];

export async function fetchPositions() {
  const res = await privateApi.get<ApiResponse<PositionWithAttributes[]>>(
    "/positions",
  );
  return res.data;
}

export async function fetchPosition(id: string) {
  const res = await privateApi.get<ApiResponse<PositionWithAttributes>>(
    `/positions/${id}`,
  );
  return res.data;
}

export async function createPosition(payload: CreatePositionPayload) {
  const res =
    await privateApi.post<ApiResponse<PositionWithAttributes>>(
      "/positions",
      payload,
    );
  return res.data;
}

export async function updatePosition(
  id: string,
  payload: UpdatePositionPayload,
) {
  const res = await privateApi.patch<ApiResponse<PositionWithAttributes>>(
    `/positions/${id}`,
    payload,
  );
  return res.data;
}

export async function deletePosition(id: string) {
  const res = await privateApi.delete<ApiResponse<PositionWithAttributes>>(
    `/positions/${id}`,
  );
  return res.data;
}

export async function addPositionAttribute(
  positionId: string,
  attributeId: string,
) {
  const res = await privateApi.post<ApiResponse<PositionWithAttributes>>(
    `/positions/${positionId}/attributes`,
    { attributeId },
  );
  return res.data;
}

export async function removePositionAttribute(
  positionId: string,
  attributeId: string,
) {
  const res = await privateApi.delete<ApiResponse<PositionWithAttributes>>(
    `/positions/${positionId}/attributes/${attributeId}`,
  );
  return res.data;
}

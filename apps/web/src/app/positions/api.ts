import { privateApi } from "@/lib/api/client";
import type { ApiResponse } from "@/models/api";
import type { Position } from "@rh/database/client";
import type { PositionGetPayload } from "@rh/database/models";
import type { CreatePositionPayload, UpdatePositionPayload } from "@rh/shared";

export async function fetchPositions() {
  const res = await privateApi.get<
    ApiResponse<
      PositionGetPayload<{
        include: {
          attributes: true;
        };
      }>[]
    >
  >("/positions");
  return res.data;
}

export async function fetchPosition(id: string) {
  const res = await privateApi.get<
    ApiResponse<
      PositionGetPayload<{
        include: {
          attributes: true;
        };
      }>
    >
  >(`/positions/${id}`);
  return res.data;
}

export async function createPosition(payload: CreatePositionPayload) {
  const res = await privateApi.post<ApiResponse<Position>>("/positions", payload);
  return res.data;
}

export async function updatePosition(id: string, payload: UpdatePositionPayload) {
  const res = await privateApi.patch<
    ApiResponse<
      PositionGetPayload<{
        include: {
          attributes: true;
        };
      }>
    >
  >(`/positions/${id}`, payload);
  return res.data;
}

export async function deletePosition(id: string) {
  const res = await privateApi.delete<ApiResponse<Position>>(`/positions/${id}`);
  return res.data;
}

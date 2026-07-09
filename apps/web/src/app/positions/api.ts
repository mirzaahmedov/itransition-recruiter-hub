import { privateApi } from "@/lib/api/client";
import type { ApiResponse } from "@/models/api";
import type { Position } from "@rh/database/client";
import type { PositionCreatePayload } from "@rh/shared";

export async function fetchPositions() {
  const res = await privateApi.get<ApiResponse<Position[]>>("/positions");
  return res.data;
}

export async function createPosition(payload: PositionCreatePayload) {
  const res = await privateApi.post<ApiResponse<Position>>("/positions", payload);
  return res.data;
}

import { publicApi } from "@/lib/api/client";
import type { Position } from "@rh/database/browser";
import type { ApiResponse } from "@rh/shared/models";

export interface DashboardStats {
  resume: number;
  activePosition: number;
  candidate: number;
}

export async function fetchDashboardStats() {
  const res = await publicApi.get<ApiResponse<DashboardStats>>("/dashboard/stats");
  return res.data;
}
export async function fetchLatestPositions() {
  const res = await publicApi.get<ApiResponse<Position[]>>("/dashboard/positions/latest");
  return res.data;
}
export async function fetchPopularPositions() {
  const res = await publicApi.get<ApiResponse<Position[]>>("/dashboard/positions/popular");
  return res.data;
}

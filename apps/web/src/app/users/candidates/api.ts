import { privateApi } from "@/lib/api/client";
import type { ApiResponse } from "@/models/api";
import type { UserGetPayload } from "@rh/database/models";

export interface CandidateUser extends UserGetPayload<{
  include: {
    resumes: true;
  };
}> {}

export async function fetchCandidates() {
  const res = await privateApi.get<ApiResponse<CandidateUser[]>>("/users/candidates");
  return res.data;
}

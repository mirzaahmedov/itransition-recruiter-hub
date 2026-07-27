import { privateApi } from "@/lib/api/client";
import type { ResumeLikeGetPayload } from "@rh/database/models";
import type { ApiResponse } from "@rh/shared/models";

export type ResumeLikeItem = ResumeLikeGetPayload<{
  include: {
    resume: {
      include: {
        position: true;
        user: true;
      };
    };
  };
}>;

export async function fetchResumeLikes() {
  const res = await privateApi.get<ApiResponse<ResumeLikeItem[]>>("/resumes/likes");
  return res.data;
}

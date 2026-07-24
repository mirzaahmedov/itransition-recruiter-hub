import { privateApi } from "@/lib/api/client";
import type { ApiResponse } from "@/models/api";
import type { User } from "@rh/database/browser";
import type { ResumeAttributeGetPayload, ResumeGetPayload } from "@rh/database/models";

type ResumeAttributeInclude = {
  positionAttribute: {
    include: {
      attribute: {
        include: {
          choices: true;
        };
      };
    };
  };
  userAttribute: {
    include: {
      attribute: true;
      choice: true;
    };
  };
};
export type ResumeAttributeItem = ResumeAttributeGetPayload<{
  include: ResumeAttributeInclude;
}>;

export type ResumeListItem = ResumeGetPayload<{
  include: {
    position: true;
    user: true;
    resumeAttributes: {
      include: ResumeAttributeInclude;
    };
  };
}>;

export type ResumeDetail = ResumeListItem & {
  user: User;
};

export async function fetchMyResumes() {
  const res = await privateApi.get<ApiResponse<ResumeListItem[]>>("/resumes");
  return res.data;
}

export async function fetchResume(id: string) {
  const res = await privateApi.get<ApiResponse<ResumeDetail>>(`/resumes/${id}`);
  return res.data;
}

export async function fetchPositionResumes(positionId: string) {
  const res = await privateApi.get<ApiResponse<ResumeListItem[]>>(`/positions/${positionId}/resumes`);
  return res.data;
}

export async function publishResume(positionId: string, id: string) {
  const res = await privateApi.post<ApiResponse<ResumeDetail>>(`/positions/${positionId}/resumes/${id}/publish`);
  return res.data;
}

export async function updateResumeStatus(positionId: string, id: string, status: "PENDING" | "PUBLISHED") {
  const res = await privateApi.patch<ApiResponse<ResumeDetail>>(`/positions/${positionId}/resumes/${id}`, { status });
  return res.data;
}

export async function deleteResume(positionId: string, id: string) {
  const res = await privateApi.delete<ApiResponse<void>>(`/positions/${positionId}/resumes/${id}`);
  return res.data;
}

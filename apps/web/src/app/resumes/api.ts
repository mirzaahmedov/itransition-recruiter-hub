import { privateApi } from "@/lib/api/client";
import type { ApiResponse } from "@/models/api";
import type { User } from "@rh/database/browser";

export type ResumeAttributeItem = {
  id: string;
  positionAttribute: {
    id: string;
    attribute: {
      id: string;
      name: string;
      type: string;
      categoryId: string;
    };
  };
  userAttribute: {
    id: string;
    textValue: string | null;
    numberValue: number | null;
    booleanValue: boolean | null;
    dateValue: string | null;
    startDateValue: string | null;
    endDateValue: string | null;
    attribute: {
      id: string;
      name: string;
      type: string;
      categoryId: string;
    };
    choice: {
      id: string;
      value: string;
    } | null;
  };
};

export type ResumeListItem = {
  id: string;
  positionId: string;
  userId: string;
  status: "PENDING" | "PUBLISHED";
  position: {
    id: string;
    title: string;
    description: string;
  };
  user?: User;
  resumeAttributes: ResumeAttributeItem[];
};

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
  const res = await privateApi.get<ApiResponse<ResumeListItem[]>>(
    `/positions/${positionId}/resumes`,
  );
  return res.data;
}

export async function publishResume(positionId: string, id: string) {
  const res = await privateApi.post<ApiResponse<ResumeDetail>>(
    `/positions/${positionId}/resumes/${id}/publish`,
  );
  return res.data;
}

export async function updateResumeStatus(
  positionId: string,
  id: string,
  status: "PENDING" | "PUBLISHED",
) {
  const res = await privateApi.patch<ApiResponse<ResumeDetail>>(
    `/positions/${positionId}/resumes/${id}`,
    { status },
  );
  return res.data;
}

export async function deleteResume(positionId: string, id: string) {
  const res = await privateApi.delete<ApiResponse<void>>(
    `/positions/${positionId}/resumes/${id}`,
  );
  return res.data;
}

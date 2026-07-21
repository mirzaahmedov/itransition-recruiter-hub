import { privateApi } from "@/lib/api/client";
import type { ApiResponse } from "@/models/api";
import type { User, UserAttribute, Project } from "@rh/database/browser";
import type { UserAttributeGetPayload } from "@rh/database/models";
import type { UpdateUserProfileAttributePayload, BulkCreateUserProfileAttributePayload, BulkUpdateUserProfileAttributePayload, UpdateUserProfilePayload, CreateProjectPayload, UpdateProjectPayload } from "@rh/shared/schemas";

export interface UserAttributeWithJoins extends UserAttributeGetPayload<{
  include: {
    attribute: true;
    choice: true;
  };
}> {}

interface IdParams {
  userId: string;
}

export async function fetchUser(userId: string) {
  const res = await privateApi.get<ApiResponse<User>>(`/users/${userId}`);
  return res.data;
}

export async function fetchUserAttributes(userId: string) {
  const res = await privateApi.get<ApiResponse<UserAttributeWithJoins[]>>(`/users/${userId}/attributes`);
  return res.data;
}

export async function createBulkUserAttributes({ ids, userId }: BulkCreateUserProfileAttributePayload & Pick<IdParams, "userId">) {
  const res = await privateApi.post(`/users/${userId}/attributes`, {
    ids,
  });
  return res.data;
}

interface UserAttributeUpdateArgs {
  id: string;
  userId: string;
  version: number;
  data: UpdateUserProfileAttributePayload;
}
export async function updateProfileAttribute({ id, userId, version, data }: UserAttributeUpdateArgs) {
  const res = await privateApi.patch(`/users/${userId}/attributes/${id}`, data, {
    params: {
      version,
    },
  });
  return res.data;
}

export interface BulkUpdateUserAttributeArgs {
  userId: string;
  data: BulkUpdateUserProfileAttributePayload;
}
export async function bulkUpdateProfileAttributes({ userId, data }: BulkUpdateUserAttributeArgs) {
  const res = await privateApi.patch<
    ApiResponse<{
      concurrent_modification: BulkUpdateUserProfileAttributePayload;
      failed_unknown: BulkUpdateUserProfileAttributePayload;
      modified: UserAttribute[];
    }>
  >(`/users/${userId}/attributes/bulk`, data);
  return res.data;
}

export async function uploadProfilePicture(id: string, file: File) {
  const formData = new FormData();

  formData.set("image", file);

  const res = await privateApi.put(`/users/${id}/profile-picture`, formData);
  return res.data;
}

export async function updateUserProfile(id: string, data: UpdateUserProfilePayload) {
  const res = await privateApi.patch<ApiResponse<User>>(`/users/${id}`, data);
  return res.data;
}

export async function fetchUserProjects(userId: string) {
  const res = await privateApi.get<ApiResponse<Project[]>>(`/users/${userId}/projects`);
  return res.data;
}

export async function createProject(userId: string, data: CreateProjectPayload) {
  const res = await privateApi.post<ApiResponse<Project>>(`/users/${userId}/projects`, data);
  return res.data;
}

export async function updateProject(userId: string, projectId: string, data: UpdateProjectPayload) {
  const res = await privateApi.patch<ApiResponse<Project>>(`/users/${userId}/projects/${projectId}`, data);
  return res.data;
}

export async function deleteProject(userId: string, projectId: string) {
  const res = await privateApi.delete<ApiResponse<Project>>(`/users/${userId}/projects/${projectId}`);
  return res.data;
}

export async function uploadProjectImage(userId: string, projectId: string, file: File) {
  const formData = new FormData();
  formData.set("image", file);
  const res = await privateApi.post<ApiResponse<Project>>(`/users/${userId}/projects/${projectId}/image`, formData);
  return res.data;
}

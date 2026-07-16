import { privateApi } from "@/lib/api/client";
import type { ApiResponse } from "@/models/api";
import type { User } from "@rh/database/browser";
import type { UserAttributeGetPayload } from "@rh/database/models";
import type { ProfileAttributeUpdatePayload, ProfileAttributeCreateBulkPayload } from "@rh/shared/schemas";

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

export async function createBulkUserAttributes({ ids, userId }: ProfileAttributeCreateBulkPayload & Pick<IdParams, "userId">) {
  const res = await privateApi.post(`/users/${userId}/attributes`, {
    ids,
  });
  return res.data;
}

interface UserAttributeUpdateArgs {
  id: string;
  userId: string;
  version: number;
  data: ProfileAttributeUpdatePayload;
}
export async function updateProfileAttribute({ id, userId, version, data }: UserAttributeUpdateArgs) {
  const res = await privateApi.patch(`/users/${userId}/attributes/${id}`, data, {
    params: {
      version,
    },
  });
  return res.data;
}

export async function uploadProfilePicture(id: string, file: File) {
  const formData = new FormData();

  formData.set("image", file);

  const res = await privateApi.put(`/users/${id}/profile-picture`, formData);
  return res.data;
}

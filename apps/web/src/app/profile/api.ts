import { privateApi } from "@/lib/api/client";
import type { ApiResponse } from "@/models/api";
import type { UserProfileGetPayload } from "@rh/database/models";
import type { ProfileAttributeCreatePayload, ProfileAttributeUpdatePayload } from "@rh/shared";

export type UserProfileWithAttributes = UserProfileGetPayload<{
  include: {
    attrs: {
      include: {
        attribute: true;
      };
    };
  };
}>;

export async function fetchProfile() {
  const res = await privateApi.get<ApiResponse<UserProfileWithAttributes>>("/users/profile");
  return res.data;
}

export async function createProfileAttribute(payload: ProfileAttributeCreatePayload) {
  const res = await privateApi.post("/profile-attributes", payload);
  return res.data;
}

export async function updateProfileAttribute(id: string, version: number, payload: ProfileAttributeUpdatePayload) {
  const res = await privateApi.patch(`/profile-attributes/${id}`, payload, {
    params: {
      version,
    },
  });
  return res.data;
}

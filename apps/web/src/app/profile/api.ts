import { privateApi } from "@/lib/api/client";
import type { ApiResponse } from "@/models/api";
import type { UserProfileGetPayload } from "@rh/database/models";
import type { ProfileAttributeCreatePayload } from "@rh/shared";

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

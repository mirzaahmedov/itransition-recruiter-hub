import { privateApi } from "@/lib/api/client";
import type { ApiResponse } from "@/models/api";
import type { UserProfileGetPayload } from "@rh/database/models";
import type { AttributeValueCreatePayload } from "@rh/shared";

export type UserProfileWithAttributes = UserProfileGetPayload<{
  include: {
    attrs: true;
  };
}>;

export async function fetchProfile() {
  const res = await privateApi.get<ApiResponse<UserProfileWithAttributes>>("/users/profile");
  return res.data;
}

export async function createProfileAttributeValue(payload: AttributeValueCreatePayload) {
  const res = await privateApi.post("/attribute-values", payload);
  return res.data;
}

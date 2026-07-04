import { publicApi } from "@/lib/api/client";

export async function loginGoogle() {
  const res = await publicApi.get("/auth/google");
  return res.data;
}

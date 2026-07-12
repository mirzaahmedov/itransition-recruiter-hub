import { privateApi } from "@/lib/api/client";
import type { CategoryGetPayload } from "@rh/database/models";

export async function fetchSearchAttributes(search: string) {
  const res = await privateApi.get<
    CategoryGetPayload<{
      include: {
        attrs: true;
      };
    }>[]
  >("/attributes/search", {
    params: {
      search,
    },
  });
  return res.data;
}

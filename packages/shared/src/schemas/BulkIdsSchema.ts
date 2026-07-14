import { z } from "zod";

export const BulkIdsSchema = z.object({
  ids: z.array(z.string()).nonempty(),
});

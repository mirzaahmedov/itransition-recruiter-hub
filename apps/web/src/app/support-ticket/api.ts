import { privateApi } from "@/lib/api/client";
import type { CreateSupportTicketPayload } from "@rh/shared/schemas";

export const createSupportTicket = (data: CreateSupportTicketPayload) => privateApi.post("/support-tickets", data);

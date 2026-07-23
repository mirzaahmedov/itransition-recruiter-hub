import axios from "axios";

import type { ErrorResponse } from "@rh/shared/models";

export function parseApiErrorMessage(error: unknown): string {
  if (!error) return "An unknown error occurred.";

  if (axios.isAxiosError(error)) {
    const serverData = error.response?.data as ErrorResponse<any> | undefined;

    if (serverData) {
      if (typeof serverData.data === "string" && serverData.data.trim() !== "") {
        return serverData.data;
      }

      if (Array.isArray(serverData.data)) {
        return serverData.data.join(", ");
      }

      if (typeof serverData.data === "string" && serverData.data.trim() !== "") {
        return serverData.data;
      }
    }

    if (error.code === "ECONNABORTED") return "Request timed out. Please try again.";
    if (error.message === "Network Error") return "Network error. Please check your internet connection.";

    if (error.response?.statusText) {
      return `Error ${error.response.status}: ${error.response.statusText}`;
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return String(error);
}

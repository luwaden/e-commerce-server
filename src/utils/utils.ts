import { ApiError } from "../types/ApiError";

export const getError = (error: ApiError): string => {
  if (error.response && error.response.data && error.response.data.message) {
    return error.response.data.message; // Specific error message from API
  }
  if (error.response && typeof error.response === "string") {
    return error.response; // If response itself is a string
  }
  return "An unknown error occurred."; // Fallback message
};

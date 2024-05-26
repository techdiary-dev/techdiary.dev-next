import { http } from "@/http/http.client";

export const ensureCSRF = async (callback: Function) => {
  try {
    await http.get("sanctum/csrf-cookie");
    return callback();
  } catch (error) {
    alert("CSRF token not found. Please reload the page.");
  }
};

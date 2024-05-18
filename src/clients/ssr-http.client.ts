import axios from "axios";
import { cookies } from "next/headers";

export const ssrHttp = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    "X-Requested-With": "XMLHttpRequest",
    Cookie: cookies()
      .getAll()
      .map((c) => `${c.name}=${c.value}`)
      .join("; "),
    referer: "http://app.techdiary.test:3000",
  },
  withCredentials: true,
  withXSRFToken: true,
});

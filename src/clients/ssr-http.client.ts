"use server";
import axios from "axios";

export const ssrHttp = (cookies: any[]) =>
  axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "X-Requested-With": "XMLHttpRequest",
      Cookie: cookies.map((c: any) => `${c.name}=${c.value}`).join("; "),
      referer: "http://app.techdiary.test:3000",
    },
    withCredentials: true,
    withXSRFToken: true,
  });

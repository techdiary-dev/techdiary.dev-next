"use server";

import { ssrHttp } from "@/clients/ssr-http.client";
import { cookies } from "next/headers";

export const logout = async () => {
  // await ssrHttp.post("api/auth/logout");
  cookies().delete("XSRF-TOKEN");
};

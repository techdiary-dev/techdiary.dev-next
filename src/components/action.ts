"use server";

import { cookies } from "next/headers";

export const logout = async () => {
  // await ssrHttp.post("api/auth/logout");
  cookies().delete("XSRF-TOKEN");
};

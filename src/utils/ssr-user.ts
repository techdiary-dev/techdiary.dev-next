import { IUser } from "@/http/models/User.model";
import { cookies } from "next/headers";

export const ssrGetMe = async () => {
  const _cookies = cookies().getAll();
  const api = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/profile/me`, {
    method: "GET",
    headers: {
      Cookie: _cookies.map((c) => `${c.name}=${c.value}`).join("; "),
      referer: process.env.NEXT_PUBLIC_APP_URL,
      Accept: "application/json",
    } as any,
  });
  const me = (await api.json()) as IUser;

  return { me, status: api.status };
};

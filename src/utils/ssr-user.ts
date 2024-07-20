import { IUser } from "@/http/models/User.model";
import { cookies } from "next/headers";

export const cookieHeaders = () => {
  const _cookies = cookies().getAll();
  return {
    Cookie: _cookies.map((c) => `${c.name}=${c.value}`).join("; "),
    referer: process.env.NEXT_PUBLIC_APP_URL,
    Accept: "application/json",
  };
};

export const ssrGetMe = async () => {
  const _cookies = cookies().getAll();

  if (_cookies.length === 0) {
    return { status: 401, me: null };
  }

  try {
    const api = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/profile/me`,
      {
        method: "GET",
        headers: cookieHeaders() as any,
      }
    );
    const me = (await api.json()) as IUser;

    return { me, status: api.status };
  } catch (error) {
    throw new Error("Failed to fetch");
  }
};

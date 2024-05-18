import { http } from "@/clients/http.client";
import { ssrHttp } from "@/clients/ssr-http.client";
import Logout from "@/components/logout";
import { cookies } from "next/headers";

export default async function Home() {
  const _cookies = cookies().getAll();

  const me = await http.get("api/profile/me", {
    headers: {
      Cookie: _cookies.map((c) => `${c.name}=${c.value}`).join("; "),
      referer: process.env.NEXT_PUBLIC_APP_URL,
    },
  });

  return (
    <div>
      <Logout />
      <pre>{JSON.stringify(me.data, null, 2)}</pre>
    </div>
  );
}

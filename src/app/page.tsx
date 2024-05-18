import { ssrHttp } from "@/clients/ssr-http.client";
import Logout from "@/components/logout";

export default async function Home() {
  const mine = await ssrHttp.get("api/articles/mine");
  const me = await ssrHttp.get("api/profile/me");

  return (
    <div>
      <Logout />
      <pre>{JSON.stringify({ me: me.data, article: mine.data }, null, 2)}</pre>
    </div>
  );
}

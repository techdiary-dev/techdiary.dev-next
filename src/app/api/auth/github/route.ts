import { generateRandomString } from "@/lib/utils";
import { cookies } from "next/headers";

export async function GET(): Promise<Response> {
  const state = generateRandomString(20);
  const authorizationUrl = createGithubAuthrizationURL(
    state,
    process.env.GITHUB_CLIENT_ID!,
    process.env.GITHUB_CALLBACK_URL!
  );

  // Store state in cookie
  const _cookies = await cookies();
  _cookies.set("github_oauth_state", state, {
    path: "/",
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    maxAge: 60 * 10,
    sameSite: "lax",
  });

  return new Response(null, {
    status: 302,
    headers: {
      Location: authorizationUrl.toString(),
    },
  });
}

export const createGithubAuthrizationURL = (
  state: string,
  clientId: string,
  redirectUri: string
) => {
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: "user:email",
    state,
  });

  return new URL(
    `https://github.com/login/oauth/authorize?${params.toString()}`
  );
};

import { createSession } from "@/backend/actions/session.action";
import { syncAuthenticatedGithubUser } from "@/backend/actions/user.action";
import { IGithubUser } from "@/backend/models/models";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");

  const _cookies = await cookies();
  const storedState = _cookies.get("github_oauth_state")?.value ?? null;
  if (code === null || state === null || storedState === null) {
    return NextResponse.json({ error: "Please restart the process." });
  }
  if (state !== storedState) {
    return NextResponse.json({ error: "Please restart the process." });
  }

  let tokens: GitHubTokenResponse;
  try {
    tokens = await validateGitHubCode(
      code,
      process.env.GITHUB_CLIENT_ID!,
      process.env.GITHUB_CLIENT_SECRET!,
      process.env.GITHUB_CALLBACK_URL!
    );
  } catch {
    // Invalid code or client credentials
    return new Response("Please restart the process.", {
      status: 400,
    });
  }

  const githubAccessToken = tokens.access_token;
  const githubAPI = await fetch("https://api.github.com/user", {
    headers: {
      Authorization: `Bearer ${githubAccessToken}`,
    },
  });
  if (!githubAPI.ok) {
    return new Response("Please restart the process.", {
      status: 400,
    });
  }

  const githubUserResponse = (await githubAPI.json()) as IGithubUser;
  const dbUser = await syncAuthenticatedGithubUser(githubUserResponse);
  await createSession(dbUser.id);

  return new Response(null, {
    status: 302,
    headers: {
      Location: "/",
    },
  });
}

interface GitHubTokenResponse {
  access_token: string;
  token_type: string;
  scope: string;
}

export const validateGitHubCode = async (
  code: string,
  clientId: string,
  clientSecret: string,
  redirectUri: string
): Promise<GitHubTokenResponse> => {
  const params = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    code: code,
    redirect_uri: redirectUri,
  });

  const response = await fetch(
    `https://github.com/login/oauth/access_token?${params.toString()}`,
    {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to validate GitHub code");
  }

  const data = await response.json();
  return data;
};

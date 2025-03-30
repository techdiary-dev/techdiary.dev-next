import { GithubOAuthService } from "@/backend/services/oauth/GithubOAuthService";
import { RepositoryException } from "@/backend/services/RepositoryException";
import * as sessionActions from "@/backend/services/session.actions";
import * as userActions from "@/backend/services/user.repository";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const githubOAuthService = new GithubOAuthService();

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const code = url.searchParams.get("code");
    const state = url.searchParams.get("state");
    const afterAuthRedirect = await sessionActions.getAfterAuthRedirect();

    if (code === null || state === null) {
      return NextResponse.json({ error: "Please restart the process." });
    }

    const githubUser = await githubOAuthService.getUserInfo(code!, state!);

    const bootedSocialUser = await userActions.bootSocialUser({
      service: "github",
      service_uid: githubUser.id.toString(),
      name: githubUser.name,
      username: githubUser.login,
      email: githubUser.email,
      profile_photo: githubUser.avatar_url,
      bio: githubUser.bio,
    });

    await sessionActions.createLoginSession({
      user_id: bootedSocialUser?.user.id!,
      request,
    });

    if (afterAuthRedirect) {
      return new Response(null, {
        status: 302,
        headers: {
          Location: afterAuthRedirect ?? "/",
        },
      });
    }

    return new Response(null, {
      status: 302,
      headers: {
        Location: "/",
      },
    });
  } catch (error) {
    if (error instanceof RepositoryException) {
      return NextResponse.json({ error: error.toString() }, { status: 400 });
    }
    if (error instanceof Error) {
      return NextResponse.json(
        { error: "Something went wrong" },
        { status: 500 }
      );
    }
  }
}

import { GithubOAuthService } from "@/backend/services/oauth/GithubOAuthService";
import * as sessionActions from "@/backend/services/session.actions";
const githubOAuthService = new GithubOAuthService();

export async function GET(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const authorizationUrl = await githubOAuthService.getAuthorizationUrl();
  const next = url.searchParams.get("next");
  if (next) {
    await sessionActions.setAfterAuthRedirect(next);
  }

  return new Response(null, {
    status: 302,
    headers: {
      Location: authorizationUrl,
    },
  });
}

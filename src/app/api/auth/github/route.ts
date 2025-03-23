import { GithubOAuthService } from "@/backend/services/oauth/GithubOAuthService";
const githubOAuthService = new GithubOAuthService();

export async function GET(): Promise<Response> {
  const authorizationUrl = await githubOAuthService.getAuthorizationUrl();
  return new Response(null, {
    status: 302,
    headers: {
      Location: authorizationUrl,
    },
  });
}

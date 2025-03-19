import { revalidateTag } from "next/cache";

export const GET = async (request: Request) => {
  const { searchParams } = new URL(request.url);
  const tagName = searchParams.get("tagName");

  if (!tagName) {
    return new Response("Missing tagName");
  }

  revalidateTag(tagName!);
  return new Response("Cache cleared");
};

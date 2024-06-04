import { NextRequest } from "next/server";

export const GET = async (request: NextRequest) => {
  try {
    const searchParams = request.nextUrl.searchParams;

    const params = new URLSearchParams({
      client_id: process.env.UNSPLASH_CLIENT_ID!,
      query: searchParams.get("query") || "",
      per_page: searchParams.get("per_page") || "10",
      page: searchParams.get("page") || "1",
    });

    const api = await fetch(
      "https://api.unsplash.com/search/photos?" + params.toString()
    );
    const data = await api.json();

    return Response.json(data);
  } catch (error) {
    return new Response(JSON.stringify(error), { status: 500 });
  }
};

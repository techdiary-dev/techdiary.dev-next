import { cookies } from "next/headers";
import { NextRequest } from "next/server";

export const POST = async (request: NextRequest) => {
  try {
    // clear cookies
    cookies().delete({
      name: "techdiaryapi_session",
      path: "/",
      domain: ".techdiary.test",
      httpOnly: true,
    });
    cookies().delete({
      name: "techdiaryapi_session",
      path: "/",
      domain: ".techdiary.test",
      httpOnly: true,
    });
    return new Response(null, { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify(error), { status: 500 });
  }
};

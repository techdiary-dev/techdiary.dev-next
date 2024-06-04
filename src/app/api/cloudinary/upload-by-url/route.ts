import { NextRequest } from "next/server";
const cloudinary = require("cloudinary").v2;

cloudinary.config({ secure: true });

export const POST = async (request: NextRequest) => {
  try {
    const body = await request.json();

    const result = await cloudinary.uploader.upload(body.url, {
      folder: "blog",
    });

    return Response.json(result);
  } catch (error) {
    return new Response(JSON.stringify(error), { status: 500 });
  }
};

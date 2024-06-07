import { NextRequest } from "next/server";
import { v2 as cloudinary } from "cloudinary";
// const cloudinary = require("cloudinary").v2;

cloudinary.config({ secure: true });

export const POST = async (request: NextRequest) => {
  try {
    const fd = await request.formData();
    console.log(fd.get("file"));
    const _file = fd.get("file");
    // const result = await cloudinary.uploader.upload(_file, {
    //   public_id: fd.get("public_id"),
    //   folder: fd.get("folder"),
    // });
    // upload to cloudinary
    // return Response.json(result);
    // return new Response(JSON.stringify(result), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify(error), { status: 500 });
  }
};

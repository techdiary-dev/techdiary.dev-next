"use server";

import { generateRandomString } from "@/lib/utils";
import { cookies } from "next/headers";
import { userAgent } from "next/server";
import { persistenceRepository } from "../persistence-repositories";

export const createSession = async (userId: string, request: Request) => {
  const _cookies = await cookies();
  const token = generateRandomString(50);

  const agent = userAgent(request);

  await persistenceRepository.userSession.createOne({
    user_id: userId,
    token,
  });

  _cookies.set("session", token, {
    path: "/",
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 30,
    sameSite: "lax",
  });
};

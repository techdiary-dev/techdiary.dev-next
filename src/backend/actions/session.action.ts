"use server";

import { generateRandomString } from "@/lib/utils";
import { cookies } from "next/headers";
import { UserSession } from "../models/domain-models";
import { pgClient } from "../persistence/database-drivers/pg.client";
import { PersistentRepository } from "../persistence/persistence.repository";
import { persistenceRepository } from "../persistence-repositories";

export const createSession = async (userId: string) => {
  const _cookies = await cookies();
  const token = generateRandomString(50);

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

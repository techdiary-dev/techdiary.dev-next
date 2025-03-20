"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export const setLanguage = async (language: "en" | "bn", path = "/") => {
  const _cookies = await cookies();
  _cookies.set("language", language);
  revalidatePath(path, "page");
};

export const toggleLanguage = async () => {
  const _cookies = await cookies();
  _cookies.set(
    "language",
    _cookies.get("language")?.value === "en" ? "bn" : "en"
  );
};

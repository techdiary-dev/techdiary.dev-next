"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export const setLanguage = async (language: "en" | "bn", path = "/") => {
  const cookieStore = await cookies();
  cookieStore.set("language", language);
  revalidatePath(path, "page");
};

export const toggleLanguage = async () => {
  const cookieStore = await cookies();
  cookieStore.set(
    "language",
    cookieStore.get("language")?.value === "en" ? "bn" : "en"
  );
};

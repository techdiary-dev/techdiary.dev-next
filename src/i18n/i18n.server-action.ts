"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export const setLanguage = (language: "en" | "bn") => {
  cookies().set("language", language);
  revalidatePath("/", "page");
};

export const toggleLanguage = () => {
  cookies().set(
    "language",
    cookies().get("language")?.value === "en" ? "bn" : "en"
  );
};

"use server";

import { cookies } from "next/headers";

export const setLanguage = (language: "en" | "bn") => {
  cookies().set("language", language);
};

export const toggleLanguage = () => {
  cookies().set(
    "language",
    cookies().get("language")?.value === "en" ? "bn" : "en"
  );
};

import { cookies } from "next/headers";
import bn from "@/i18n/bn.json";

const dictionaries: {
  [key: string]: any;
} = { bn };

const _ts = (key: string) => {
  const _lang = cookies().get("language")?.value || "bn";
  return dictionaries[_lang]?.[key] || key;
};

export default _ts;

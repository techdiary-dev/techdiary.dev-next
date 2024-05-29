import { revalidatePath } from "next/cache";

export const GET = async () => {
  revalidatePath("/", "page");

  return new Response("Cache cleared");
};

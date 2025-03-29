import { sanitizedUsername } from "@/lib/utils";
import React from "react";
import UserArticleFeed from "./UserArticleFeed";
import { getUserByUsername } from "@/backend/services/user.action";

interface PageProps {
  params: Promise<{ username: string }>;
}
const Page: React.FC<PageProps> = async ({ params }) => {
  const _params = await params;
  const username = sanitizedUsername(_params?.username);
  const profile = await getUserByUsername(username, ["id", "username"]);

  return (
    <main className="border rounded-bl-2xl rounded-br-2xl md:col-span-9 col-span-full">
      <UserArticleFeed userId={profile?.id!} />
    </main>
  );
};

export default Page;

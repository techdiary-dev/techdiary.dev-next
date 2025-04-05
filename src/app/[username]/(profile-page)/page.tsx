import { getUserByUsername } from "@/backend/services/user.action";
import _t from "@/i18n/_t";
import { markdocParser } from "@/utils/markdoc-parser";
import Image from "next/image";
import React from "react";

interface UserProfilePageProps {
  params: Promise<{ username: string }>;
}
const UserProfilePage: React.FC<UserProfilePageProps> = async ({ params }) => {
  const _params = await params;
  const username = _params?.username?.startsWith("%40")
    ? _params.username.replaceAll("%40", "").toLowerCase()
    : _params.username.toLowerCase();

  const profile = await getUserByUsername(username, ["profile_readme"]);
  // return <pre>{JSON.stringify(profile, null, 2)}</pre>;

  return (
    <main className="border rounded-bl-2xl rounded-br-2xl md:col-span-9 col-span-full">
      {profile?.profile_readme ? (
        <div
          dangerouslySetInnerHTML={{
            __html: markdocParser(profile?.profile_readme ?? ""),
          }}
          className="p-3 content-typography"
        ></div>
      ) : (
        <div className="py-10 flex flex-col items-center justify-center gap-4">
          <Image
            src="/images/robots-drones-artificial-intelligence-1.png"
            alt="Error"
            width={300}
            height={300}
            className="mx-auto"
          />
          <h1 className="text-2xl font-semibold">
            {_t("No profile readme found")}
          </h1>
        </div>
      )}
    </main>
  );
};

export default UserProfilePage;

import { getUserByUsername } from "@/backend/services/user.action";
import BaseLayout from "@/components/layout/BaseLayout";
import _t from "@/i18n/_t";
import { markdownToHtml } from "@/utils/markdoc-parser";
import { Link2Icon } from "@radix-ui/react-icons";
import React from "react";
import ProfilePageAside from "./_components/ProfilePageAside";

interface UserProfilePageProps {
  params: Promise<{ username: string }>;
}
const UserProfilePage: React.FC<UserProfilePageProps> = async ({ params }) => {
  const _params = await params;
  const username = _params?.username?.startsWith("%40")
    ? _params.username.replaceAll("%40", "").toLowerCase()
    : _params.username.toLowerCase();

  const profile = await getUserByUsername(username);

  return <pre>{JSON.stringify(profile, null, 2)}</pre>;

  if (!profile) {
    return (
      <BaseLayout>
        <div className="wrapper py-10">
          <h1>hhh</h1>
        </div>
      </BaseLayout>
    );
  }
  return <h1>Profile</h1>;
};

export default UserProfilePage;

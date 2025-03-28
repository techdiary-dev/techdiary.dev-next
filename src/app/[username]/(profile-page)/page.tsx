import BaseLayout from "@/components/layout/BaseLayout";
import React from "react";

interface UserProfilePageProps {
  params: Promise<{ username: string }>;
}
const UserProfilePage: React.FC<UserProfilePageProps> = async ({ params }) => {
  const _params = await params;
  const username = _params?.username?.startsWith("%40")
    ? _params.username.replaceAll("%40", "").toLowerCase()
    : _params.username.toLowerCase();

  return (
    <BaseLayout>
      <div className="wrapper py-10">{username}</div>
    </BaseLayout>
  );
};

export default UserProfilePage;

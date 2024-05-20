import React from "react";
import SocialLinksWidget from "./widgets/SocialLinksWidget";
import ImportantLinksWidget from "./widgets/ImportantLinksWidget";
import DiscordWidget from "./widgets/DiscordWidget";
import LatestUsers from "./widgets/LatestUsers";
import SocialLogin from "./widgets/SocialLogin";

const HomeRightSidebar = () => {
  return (
    <div className="flex flex-col gap-6 p-2">
      <SocialLogin />
      <SocialLinksWidget />
      <ImportantLinksWidget />
      <DiscordWidget />
      <LatestUsers />
    </div>
  );
};

export default HomeRightSidebar;

import React from "react";
import SocialLinksWidget from "./widgets/SocialLinksWidget";
import ImportantLinksWidget from "./widgets/ImportantLinksWidget";
import DiscordWidget from "./widgets/DiscordWidget";
import LatestUsers from "./widgets/LatestUsers";

const HomeRightSidebar = () => {
  return (
    <div className="flex flex-col gap-6 p-2">
      <SocialLinksWidget />
      <ImportantLinksWidget />
      <DiscordWidget />
      <LatestUsers />
    </div>
  );
};

export default HomeRightSidebar;

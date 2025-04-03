import DiscordWidget from "@/components/widgets/DiscordWidget";
import ImportantLinksWidget from "@/components/widgets/ImportantLinksWidget";
import LatestUsers from "@/components/widgets/LatestUsers";
import SocialLinksWidget from "@/components/widgets/SocialLinksWidget";
import React from "react";

const HomeRightSidebar = () => {
  return (
    <div className="flex flex-col gap-10">
      <DiscordWidget />
      <SocialLinksWidget />
      <ImportantLinksWidget />
      <LatestUsers />
    </div>
  );
};

export default HomeRightSidebar;

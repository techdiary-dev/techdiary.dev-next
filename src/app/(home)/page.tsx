import BaseLayout from "@/components/layout/BaseLayout";
import HomepageLayout from "@/components/layout/HomepageLayout";
import _t from "@/i18n/_t";
import { Metadata } from "next";
import React from "react";
import HomeLeftSidebar from "./_components/HomeLeftSidebar";
import HomeRightSidebar from "./_components/HomeRightSidebar";

export const metadata: Metadata = {
  title: "Home",
};

const page = () => {
  return (
    <HomepageLayout
      LeftSidebar={<HomeLeftSidebar />}
      RightSidebar={<HomeRightSidebar />}
    >
      <h1>{_t("Home")}</h1>
    </HomepageLayout>
  );
};

export default page;

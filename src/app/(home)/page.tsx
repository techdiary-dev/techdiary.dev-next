import HomepageLayout from "@/components/layout/HomepageLayout";
import _t from "@/i18n/_t";
import { Metadata } from "next";
import HomeLeftSidebar from "./_components/HomeLeftSidebar";
import HomeRightSidebar from "./_components/HomeRightSidebar";
import SidebarToggleButton from "./_components/SidebarToggleButton";

export const metadata: Metadata = {
  title: "Home",
};

const Page = async () => {
  return (
    <HomepageLayout
      LeftSidebar={<HomeLeftSidebar />}
      RightSidebar={<HomeRightSidebar />}
      NavbarTrailing={<SidebarToggleButton />}
    >
      <h1>{_t("Home")}</h1>
    </HomepageLayout>
  );
};

export default Page;

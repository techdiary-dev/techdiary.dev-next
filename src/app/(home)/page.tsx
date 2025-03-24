import HomepageLayout from "@/components/layout/HomepageLayout";
import _t from "@/i18n/_t";
import { Metadata } from "next";
import HomeLeftSidebar from "./_components/HomeLeftSidebar";
import HomeRightSidebar from "./_components/HomeRightSidebar";
import SidebarToggleButton from "./_components/SidebarToggleButton";
import { articleRepository } from "@/backend/services/article.repository";

export const metadata: Metadata = {
  title: "Home",
};

const Page = async () => {
  const articles = await articleRepository.articleFeed({ limit: 30, page: 1 });

  return (
    <HomepageLayout
      LeftSidebar={<HomeLeftSidebar />}
      RightSidebar={<HomeRightSidebar />}
      NavbarTrailing={<SidebarToggleButton />}
    >
      <h1>{_t("Home")}</h1>
      <pre>{JSON.stringify(articles, null, 2)}</pre>
    </HomepageLayout>
  );
};

export default Page;

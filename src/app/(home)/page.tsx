import { http } from "@/http/http.client";
import FakeEditor from "@/components/FakeEditor";
import HomeLeftSidebar from "@/components/asides/HomeLeftSidebar";
import HomeRightSidebar from "@/components/asides/HomeRightSidebar";
import ThreeColumnLayout from "@/components/layout/ThreeColumnLayout";
import { IArticleFeedItem } from "@/http/models/Article.model";
import { PaginatedResponse } from "@/http/models/PaginatedResponse.model";
import ArticleFeed from "./components/ArticleFeed";

export default async function Home() {
  const { data: articles } = await http.get<
    PaginatedResponse<IArticleFeedItem>
  >("api/articles", {
    params: {
      limit: 20,
    },
  });

  return (
    <ThreeColumnLayout
      LeftSidebar={<HomeLeftSidebar />}
      RightSidebar={<HomeRightSidebar />}
    >
      <FakeEditor />
      <div className="mt-8">
        <ArticleFeed initialData={articles} />
      </div>
      <div className="my-20"></div>
    </ThreeColumnLayout>
  );
}

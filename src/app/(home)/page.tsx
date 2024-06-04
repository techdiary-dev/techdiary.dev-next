import { http } from "@/http/http.client";
import FakeEditor from "@/components/FakeEditor";
import HomeLeftSidebar from "@/components/asides/HomeLeftSidebar";
import HomeRightSidebar from "@/components/asides/HomeRightSidebar";
import ThreeColumnLayout from "@/components/layout/ThreeColumnLayout";
import { IArticleFeedItem } from "@/http/models/Article.model";
import { PaginatedResponse } from "@/http/models/PaginatedResponse.model";
import ArticleFeed from "./components/ArticleFeed";

// export const revalidate = 3600; // revalidate at most every hour

export default async function Home() {
  // const { data: articles } = await http.get<
  //   PaginatedResponse<IArticleFeedItem>
  // >("api/articles", { params: { limit: 20 } });

  const api = await fetch(process.env.NEXT_PUBLIC_API_URL + "/api/articles", {
    method: "GET",
    next: { revalidate: 3600 },
  });

  const articles = await api.json();

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

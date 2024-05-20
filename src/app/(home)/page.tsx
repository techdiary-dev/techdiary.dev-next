import FakeEditor from "@/components/FakeEditor";
import HomeLeftSidebar from "@/components/asides/HomeLeftSidebar";
import HomeRightSidebar from "@/components/asides/HomeRightSidebar";
import ThreeColumnLayout from "@/components/layout/ThreeColumnLayout";
import ArticleFeed from "./components/ArticleFeed";
import { http } from "@/clients/http.client";
import { PaginatedResponse } from "@/models/PaginatedResponse.model";
import { IArticleFeedItem } from "@/models/Article.model";
import { useAtom } from "jotai";
import { userAtom } from "@/store/user.atom";

export default async function Home() {
  const { data: articles } = await http.get<
    PaginatedResponse<IArticleFeedItem>
  >("api/articles", {
    params: {
      limit: 20,
    },
  });

  // const _cookies = cookies().getAll();

  // const me = await http.get("api/profile/me", {
  //   headers: {
  //     Cookie: _cookies.map((c) => `${c.name}=${c.value}`).join("; "),
  //     referer: process.env.NEXT_PUBLIC_APP_URL,
  //   },
  // });

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

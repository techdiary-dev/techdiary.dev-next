import { http } from "@/clients/http.client";
import HomeLeftSidebar from "@/components/asides/HomeLeftSidebar";
import HomeRightSidebar from "@/components/asides/HomeRightSidebar";
import SocialLinksWidget from "@/components/asides/widgets/SocialLinksWidget";
import SocialLogin from "@/components/asides/widgets/SocialLogin";
import BaseLayout from "@/components/layout/BaseLayout";
import ThreeColumnLayout from "@/components/layout/ThreeColumnLayout";
import { IArticleDetail } from "@/models/Article.model";
import { markdownToHtml } from "@/utils/markdoc-parser";
import { NextPage } from "next";
import Link from "next/link";
import LatestArticles from "./LatestArticles";

interface ArticleDetailsPageProps {
  params: {
    username: string;
    articleslug: string;
  };
}

const ArticleDetailsPage: NextPage<ArticleDetailsPageProps> = async ({
  params,
}) => {
  const {
    data: { data: article },
  } = await http.get<{ data: IArticleDetail }>(
    `/api/articles/slug/${params.articleslug}`
  );

  const html = markdownToHtml(article?.body?.markdown || "");

  return (
    <ThreeColumnLayout
      LeftSidebar={<HomeLeftSidebar />}
      RightSidebar={
        <div className="flex flex-col gap-4">
          <SocialLogin />
          <LatestArticles />
        </div>
      }
    >
      <div className="relative overflow-hidden">
        <div className="relative">
          {article.thumbnail && (
            <div>
              <img src={article.thumbnail} className="rounded-lg" />
            </div>
          )}

          <div
            className="mx-auto mt-6 content-typography"
            dangerouslySetInnerHTML={{ __html: html }}
          ></div>

          <div className="my-10">
            {/* <comments model_name="ARTICLE" :model_id="article.id" /> */}
          </div>
        </div>
      </div>
    </ThreeColumnLayout>
  );
};

export default ArticleDetailsPage;

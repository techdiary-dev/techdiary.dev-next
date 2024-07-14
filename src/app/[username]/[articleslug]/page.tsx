import { http } from "@/http/http.client";
import HomeLeftSidebar from "@/components/asides/HomeLeftSidebar";
import SocialLogin from "@/components/asides/widgets/SocialLogin";
import ThreeColumnLayout from "@/components/layout/ThreeColumnLayout";
import { IArticleDetail } from "@/http/models/Article.model";
import { markdownToHtml } from "@/utils/markdoc-parser";
import { Metadata, NextPage } from "next";
import LatestArticles from "./LatestArticles";
import AppImage from "@/components/AppImage";

interface ArticleDetailsPageProps {
  params: {
    username: string;
    articleslug: string;
  };
}

export const metadata: Metadata = {
  title: "Techdiary - A blogging platform for developers",
};

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
          <LatestArticles excludeIds={[article?.id]} />
        </div>
      }
    >
      <div className="relative overflow-hidden">
        <div className="relative">
          {article?.thumbnail && (
            <div className="rounded-lg w-full bg-red-200">
              <AppImage
                alt="App Image"
                imageSource={JSON.parse(article?.thumbnail as any)}
                width={1200}
                height={630}
              />
            </div>
          )}

          <div className=" my-6">
            <h1 className="text-3xl font-bold">{article.title}</h1>
          </div>

          <div
            className="mx-auto content-typography"
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

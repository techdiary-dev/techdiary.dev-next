import BaseLayout from "@/components/layout/BaseLayout";
import * as articleActions from "@/backend/services/article.actions";
import React from "react";
import { NextPage } from "next";
import HomepageLayout from "@/components/layout/HomepageLayout";
import HomeLeftSidebar from "@/app/(home)/_components/HomeLeftSidebar";
import { markdownToHtml } from "@/utils/markdoc-parser";
import AppImage from "@/components/AppImage";

interface ArticlePageProps {
  params: Promise<{
    username: string;
    articleHandle: string;
  }>;
}

const Page: NextPage<ArticlePageProps> = async ({ params }) => {
  const _params = await params;
  const article = await articleActions.articleDetail(_params.articleHandle);

  const parsedHTML = markdownToHtml(article?.body ?? "");

  return (
    <HomepageLayout LeftSidebar={<HomeLeftSidebar />}>
      {/* {!article && <div>Article not found</div>} */}
      <div className="px-4 my-2 md:m-0">
        {article?.cover_image && (
          <div className="rounded-sm w-full overflow-hidden">
            <AppImage
              alt={article?.title ?? ""}
              imageSource={article?.cover_image}
              width={1200}
              height={630}
            />
          </div>
        )}

        <div className="my-6">
          <h1 className="text-3xl font-bold">{article?.title ?? ""}</h1>
        </div>

        <div
          className="mx-auto content-typography"
          dangerouslySetInnerHTML={{ __html: parsedHTML }}
        ></div>
      </div>
    </HomepageLayout>
  );
};

export default Page;

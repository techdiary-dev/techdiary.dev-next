import BaseLayout from "@/components/layout/BaseLayout";
import * as articleActions from "@/backend/services/article.actions";
import React from "react";
import { Metadata, NextPage } from "next";
import HomepageLayout from "@/components/layout/HomepageLayout";
import HomeLeftSidebar from "@/app/(home)/_components/HomeLeftSidebar";
import { markdownToHtml } from "@/utils/markdoc-parser";
import AppImage from "@/components/AppImage";
import Link from "next/link";
import { readingTime, removeMarkdownSyntax } from "@/lib/utils";
import { notFound } from "next/navigation";
import ArticleSidebar from "./_components/ArticleSidebar";

export const metadata: Metadata = {
  title: "Article detail",
};

interface ArticlePageProps {
  params: Promise<{
    username: string;
    articleHandle: string;
  }>;
}

const Page: NextPage<ArticlePageProps> = async ({ params }) => {
  const _params = await params;
  const article = await articleActions.articleDetail(_params.articleHandle);

  if (!article) {
    throw notFound();
  }

  const parsedHTML = markdownToHtml(article?.body ?? "");

  return (
    <HomepageLayout
      LeftSidebar={<HomeLeftSidebar />}
      RightSidebar={<ArticleSidebar />}
    >
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

        {/* User information */}
        <div className="mb-4 flex items-center my-4">
          <div className="relative rounded-full overflow-hidden border transition-transform duration-300 size-10">
            <img
              src={article?.user?.profile_photo}
              alt={article?.user?.username}
              className="w-full h-full object-cover transition-opacity duration-300 ease-in-out opacity-100"
            />
          </div>

          <div className="ml-2.5">
            <Link
              href={`/${article?.user?.username}`}
              className="text-md font-medium text-foreground"
            >
              {article?.user?.name}
            </Link>
            <div className="flex items-center text-xs text-muted-foreground">
              <time dateTime={article?.published_at?.toString()}>
                {new Date(article?.published_at!).toLocaleDateString("bn-BD", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </time>
              <span className="mx-1.5">·</span>
              <span>
                {readingTime(removeMarkdownSyntax(article?.body ?? "")!)} min
                read
              </span>
            </div>
          </div>
        </div>

        <div className="my-6">
          <h1 className="text-2xl font-bold">{article?.title ?? ""}</h1>
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

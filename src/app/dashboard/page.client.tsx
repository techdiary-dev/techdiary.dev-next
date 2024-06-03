"use client";

import { IArticleFeedItem } from "@/http/models/Article.model";
import { PaginatedResponse } from "@/http/models/PaginatedResponse.model";
import { ArticleRepository } from "@/http/repositories/article.repository";
import { useTranslation } from "@/i18n/use-translation";
import { Loader, Menu } from "@mantine/core";
import {
  CardStackIcon,
  ChatBubbleIcon,
  DotsHorizontalIcon,
  Pencil1Icon,
  ThickArrowUpIcon,
} from "@radix-ui/react-icons";
import { useInfiniteQuery } from "@tanstack/react-query";
import React from "react";
import { VisibilityObserver } from "reactjs-visibility";

interface IDashboardPageProps {
  initialArticles: PaginatedResponse<IArticleFeedItem>;
}

const DashboardPage: React.FC<IDashboardPageProps> = ({ initialArticles }) => {
  const { _t } = useTranslation();
  const apiRepo = new ArticleRepository();

  const { data, fetchNextPage, hasNextPage } = useInfiniteQuery<
    PaginatedResponse<IArticleFeedItem>
  >({
    queryKey: ["dashboard-articles"],
    initialData: {
      pageParams: [initialArticles?.meta?.current_page || 1],
      pages: [initialArticles],
    },
    initialPageParam: initialArticles?.meta?.current_page || 1,
    refetchOnMount: false,
    getNextPageParam: (lastPage, allPages) => {
      console.log("allPages", allPages.length);
      return allPages.length < lastPage.meta.last_page
        ? lastPage.meta.current_page + 1
        : null;
    },
    queryFn: async ({ pageParam }) => {
      return apiRepo.getMyArticles({
        page: pageParam as number,
        limit: 10,
      });
    },
  });

  return (
    <div className="flex flex-col divide-y divide-dashed divide-border-color">
      {/* <pre>{JSON.stringify(initialArticles, null, 2)}</pre> */}
      {data?.pages.map((page) => {
        return page.data.map((article, index) => (
          <article key={article.id} className="flex justify-between py-3">
            <div className="flex flex-col">
              <a className="text-forground text-lg" href={article.url}>
                {index} -{article.title}
              </a>
              {article.isPublished && (
                <p className="text-sm text-forground-muted">
                  {_t("Published on")} {article.created_at?.toString()}
                </p>
              )}
            </div>

            <div className="flex items-center gap-10">
              <div className="flex gap-4 items-center">
                {!article.isPublished && (
                  <p className="bg-yellow-400/30 rounded-sm px-2 py-1 text-sm">
                    🚧 {_t("Draft")}
                  </p>
                )}

                <div className="text-forground-muted flex items-center gap-1">
                  <ChatBubbleIcon className="h-4 w-4" />
                  <p>{article?.comments_count || 0} </p>
                </div>

                <div className="text-forground-muted flex items-center gap-1">
                  <ThickArrowUpIcon className="h-4 w-4" />
                  <p>{article?.comments_count || 0} </p>
                </div>
              </div>
              <Menu>
                <Menu.Target>
                  <button>
                    <DotsHorizontalIcon className="h-5 w-5" />
                  </button>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Item leftSection={<Pencil1Icon />}>
                    {_t("Edit")}
                  </Menu.Item>
                  <Menu.Item leftSection={<CardStackIcon />}>
                    {_t("Make archive")}
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            </div>
          </article>
        ));
      })}

      {hasNextPage && (
        <VisibilityObserver
          onChangeVisibility={(isVisible) => {
            if (isVisible) {
              fetchNextPage();
            }
          }}
          options={{ rootMargin: "200px" }}
        >
          <div className="text-center my-8">
            <Loader size={"lg"} color="blue" />
          </div>
        </VisibilityObserver>
      )}
    </div>
  );
};

export default DashboardPage;

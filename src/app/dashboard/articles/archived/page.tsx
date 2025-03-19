"use client";

import { IArticleFeedItem } from "@/http/models/Article.model";
import { PaginatedResponse } from "@/http/models/PaginatedResponse.model";
import { ArticleApiRepository } from "@/http/repositories/article.repository";
import { useTranslation } from "@/i18n/use-translation";
import { relativeTime } from "@/utils/relativeTime";
import { Loader, Menu } from "@mantine/core";
import { openConfirmModal } from "@mantine/modals";
import {
  CardStackIcon,
  ChatBubbleIcon,
  DotsHorizontalIcon,
  Pencil1Icon,
  ThickArrowUpIcon,
} from "@radix-ui/react-icons";
import { useInfiniteQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import { VisibilityObserver } from "reactjs-visibility";

const ArchievedArticlesPage = () => {
  const api = new ArticleApiRepository();
  const { _t } = useTranslation();
  const apiRepo = new ArticleApiRepository();
  const router = useRouter();

  const { data, fetchNextPage, hasNextPage } = useInfiniteQuery<
    PaginatedResponse<IArticleFeedItem>
  >({
    queryKey: ["dashboard-archived-articles"],
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      return allPages.length < lastPage.meta.last_page
        ? lastPage.meta.current_page + 1
        : null;
    },
    queryFn: async ({ pageParam }) => {
      return apiRepo.getMyArchivedArticles({
        page: pageParam as number,
        limit: 10,
      });
    },
  });

  return (
    <div className="flex flex-col divide-y divide-dashed divide-border-color">
      {/* <pre>{JSON.stringify(initialArticles, null, 2)}</pre> */}
      {data?.pages.map((page) => {
        return page.data.map((article) => (
          <article
            key={article.id}
            className="flex justify-between flex-col md:flex-row py-3 space-y-2"
          >
            <div className="flex flex-col">
              <Link
                className="text-forground text-lg"
                href={`/dashboard/articles/${article?.id}`}
              >
                {article.title}
              </Link>
              {article.is_published && (
                <p className="text-sm text-forground-muted">
                  {_t("Published on")}{" "}
                  {relativeTime(new Date(article.published_at))}
                </p>
              )}
            </div>

            <div className="flex items-center gap-10 justify-between">
              <div className="flex gap-4 items-center">
                {!article.is_published && (
                  <p className="bg-yellow-400/30 rounded-xs px-2 py-1 text-sm">
                    🚧 {_t("Draft")}
                  </p>
                )}

                <div className="text-forground-muted flex items-center gap-1">
                  <ChatBubbleIcon className="h-4 w-4" />
                  <p>{article?.comments_count || 0} </p>
                </div>

                <div className="text-forground-muted flex items-center gap-1">
                  <ThickArrowUpIcon className="h-4 w-4" />
                  <p>{article?.votes?.score || 0} </p>
                </div>
              </div>
              <Menu>
                <Menu.Target>
                  <button className="flex items-center gap-2">
                    <p className="text-sm md:hidden">{_t("Actions")}</p>
                    <DotsHorizontalIcon className="h-5 w-5" />
                  </button>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Item
                    leftSection={<Pencil1Icon />}
                    component={Link}
                    href={`/dashboard/articles/${article?.id}`}
                  >
                    {_t("Edit")}
                  </Menu.Item>
                  <Menu.Item
                    leftSection={<CardStackIcon />}
                    component="button"
                    onClick={() => {
                      openConfirmModal({
                        title: _t("Sure to permanent delete?"),
                        children: _t(
                          "Once you delete this from here then it can not be undone anymore."
                        ),
                        labels: {
                          confirm: _t("Yes"),
                          cancel: _t("Cancel"),
                        },
                        onConfirm() {
                          apiRepo.makePermanentDelete(article?.id);
                          router.refresh();
                        },
                      });
                    }}
                  >
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

export default ArchievedArticlesPage;

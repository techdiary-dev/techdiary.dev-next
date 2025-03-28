"use client";

import * as articleActions from "@/backend/services/article.actions";
import { useAppConfirm } from "@/components/app-confirm";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import VisibilitySensor from "@/components/VisibilitySensor";
import { useTranslation } from "@/i18n/use-translation";
import { formattedTime } from "@/lib/utils";
import {
  CardStackIcon,
  DotsHorizontalIcon,
  Pencil1Icon,
} from "@radix-ui/react-icons";

import { useInfiniteQuery } from "@tanstack/react-query";
import Link from "next/link";

const ArticleList = () => {
  const { _t } = useTranslation();
  const feedInfiniteQuery = useInfiniteQuery({
    queryKey: ["dashboard-articles"],
    queryFn: ({ pageParam }) =>
      articleActions.myArticles({ limit: 10, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const _page = lastPage?.meta?.currentPage ?? 1;
      return lastPage?.meta.hasNextPage ? _page + 1 : null;
    },
  });

  const appConfirm = useAppConfirm();

  return (
    <div>
      <h3 className="text-lg font-semibold">{_t("Articles")}</h3>

      <div className="flex flex-col divide-y divide-dashed divide-border-color mt-2">
        {feedInfiniteQuery.isFetching &&
          Array.from({ length: 10 }).map((_, i) => (
            <article key={i} className=" bg-muted h-20 animate-pulse" />
          ))}

        {feedInfiniteQuery.data?.pages.map((page) => {
          return page?.nodes.map((article) => (
            <article
              key={article.id}
              className="flex justify-between flex-col md:flex-row py-3 space-y-2"
            >
              <div className="flex flex-col">
                <p>{article.handle}</p>
                <Link
                  className="text-forground text-lg"
                  href={`/dashboard/articles/${article?.id}`}
                >
                  {article.title}
                </Link>
                {article.is_published && (
                  <p className="text-sm text-muted-foreground">
                    {_t("Published on")} {formattedTime(article.published_at!)}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-10 justify-between">
                <div className="flex gap-4 items-center">
                  {!article.is_published && (
                    <p className="bg-yellow-400/30 rounded-sm px-2 py-1 text-sm">
                      🚧 {_t("Draft")}
                    </p>
                  )}

                  {/* <div className="text-forground-muted flex items-center gap-1">
                  <ChatBubbleIcon className="h-4 w-4" />
                  <p>{article?.comments_count || 0} </p>
                </div> */}

                  {/* <div className="text-forground-muted flex items-center gap-1">
                  <ThickArrowUpIcon className="h-4 w-4" />
                  <p>{article?.votes?.score || 0} </p>
                </div> */}
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <button className="flex items-center gap-2">
                      <p className="text-sm md:hidden">{_t("Actions")}</p>
                      <DotsHorizontalIcon className="h-5 w-5" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem asChild>
                      <Link
                        href={`/dashboard/articles/${article?.id}`}
                        className="text-foreground"
                      >
                        <Pencil1Icon />
                        <span>{_t("Edit")}</span>
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem asChild>
                      <button
                        onClick={() => {
                          appConfirm.show({
                            title: `${_t("Sure to unpublish")}?`,
                            children: _t(
                              "If you unpublish the article, this will be excluded in home page and search results, however direct links to the article will still work."
                            ),
                            labels: {
                              confirm: _t("Yes"),
                              cancel: _t("Cancel"),
                            },
                            onConfirm() {
                              // try {
                              //   apiRepo
                              //     .makeArchive(article?.id)
                              //     .finally(() => router.refresh());
                              // } catch (error) {}
                            },
                          });
                        }}
                      >
                        <CardStackIcon />
                        <span>{_t("Make Unpublished")}</span>
                      </button>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </article>
          ));
        })}
      </div>

      {feedInfiniteQuery.hasNextPage && (
        <VisibilitySensor onLoadmore={feedInfiniteQuery.fetchNextPage} />
      )}
    </div>
  );
};

export default ArticleList;

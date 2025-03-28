"use client";

import * as articleActions from "@/backend/services/article.actions";
import VisibilitySensor from "@/components/VisibilitySensor";
import { useTranslation } from "@/i18n/use-translation";
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
                <p>{article.id}</p>
                <Link
                  className="text-forground text-lg"
                  href={`/dashboard/articles/${article?.id}`}
                >
                  {article.title}
                </Link>
                {article.is_published && (
                  <p className="text-sm text-forground-muted">
                    {_t("Published on")}{" "}
                    {/* {relativeTime(new Date(article.published_at))} */}
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
                {/* <Menu>
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
                        title: _t("Sure to archive?"),
                        children: _t("No worries, This can be undone anytime."),
                        labels: {
                          confirm: _t("Yes"),
                          cancel: _t("Cancel"),
                        },
                        onConfirm() {
                          try {
                            apiRepo
                              .makeArchive(article?.id)
                              .finally(() => router.refresh());
                          } catch (error) {}
                        },
                      });
                    }}
                  >
                    {_t("Make archive")}
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu> */}
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

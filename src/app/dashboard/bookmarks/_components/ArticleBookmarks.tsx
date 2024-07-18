import { BookmarkRepository } from "@/http/repositories/bookmark.repository";
import { useTranslation } from "@/i18n/use-translation";
import { Menu } from "@mantine/core";
import {
  CardStackIcon,
  DotsHorizontalIcon,
  Pencil1Icon,
} from "@radix-ui/react-icons";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import React from "react";

const ArticleBookmarks = () => {
  const { _t } = useTranslation();
  const api = new BookmarkRepository();
  const { data } = useQuery({
    queryKey: ["dashboard:bookmarks"],
    queryFn: async () => {
      const { data } = await api.getBookmarks({
        limit: -1,
        model_name: "ARTICLE",
      });
      return data;
    },
  });
  return (
    <div>
      {data?.data?.map((article) => (
        <article
          key={article.id}
          className="flex justify-between flex-col md:flex-row py-3 space-y-2"
        >
          <div className="flex flex-col">
            <Link
              className="text-forground text-lg"
              href={`/@${article?.user?.username}/${article?.slug}`}
            >
              {article.title}
            </Link>
          </div>
        </article>
      ))}
    </div>
  );
};

export default ArticleBookmarks;

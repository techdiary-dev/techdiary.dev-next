"use client";
import { BookmarkRepository } from "@/http/repositories/bookmark.repository";
import { Tabs } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import ArticleBookmarks from "./_components/ArticleBookmarks";
import CommentBookmarks from "./_components/CommentBookmarks";
import { useTranslation } from "@/i18n/use-translation";

const BookmarksPage = () => {
  const { _t } = useTranslation();
  return (
    <Tabs defaultValue="articles">
      <Tabs.List>
        <Tabs.Tab value="articles">{_t("Diaries")}</Tabs.Tab>
        <Tabs.Tab value="comments">{_t("Comments")}</Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel value="articles" className="py-2">
        <ArticleBookmarks />
      </Tabs.Panel>
      <Tabs.Panel value="comments" className="py-2">
        <CommentBookmarks />
      </Tabs.Panel>
    </Tabs>
  );
};

export default BookmarksPage;

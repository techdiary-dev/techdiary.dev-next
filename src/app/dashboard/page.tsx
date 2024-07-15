import { Metadata } from "next";
import React from "react";
import DashboardPage from "./page.client";
import { ArticleApiRepository } from "@/http/repositories/article.repository";
import { cookieHeaders } from "@/utils/ssr-user";
import { Paper, Text } from "@mantine/core";
import _t from "@/i18n/_t";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Dashboard",
};

const Dashboard = async () => {
  const apiRepo = new ArticleApiRepository();
  const articles = await apiRepo.getMyArticles({ limit: 10 }, cookieHeaders());

  return (
    <div>
      <Text mb={"md"}>{_t("States")}</Text>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 mb-10">
        <Paper p={"lg"} withBorder>
          <Text size="lg">{_t("Total posts")}</Text>
          <Text size={"35px"}>{articles?.meta?.total || 0}</Text>
        </Paper>
        <Paper p={"lg"} withBorder>
          <Text size="lg">{_t("Total post reactions")}</Text>
          <Text size={"35px"}>{articles?.meta?.counts?.reactions || 0}</Text>
        </Paper>
        <Paper p={"lg"} withBorder>
          <Text size="lg">{_t("Total post comments")}</Text>
          <Text size={"35px"}>{articles?.meta?.counts.comments || 0}</Text>
        </Paper>
        <Paper p={"lg"} withBorder>
          <Text size="lg">{_t("Total post bookmarks")}</Text>
          <Text size={"35px"}>{articles?.meta?.counts.comments || 0}</Text>
        </Paper>
      </div>
      <DashboardPage initialArticles={articles} />
    </div>
  );
};

export default Dashboard;

import { Metadata } from "next";
import React from "react";
import DashboardPage from "./page.client";
import { ArticleRepository } from "@/http/repositories/article.repository";
import { cookieHeaders } from "@/utils/ssr-user";

export const metadata: Metadata = {
  title: "Dashboard",
};

const Dashboard = async () => {
  const apiRepo = new ArticleRepository();
  const articles = await apiRepo.getMyArticles({ limit: 20 }, cookieHeaders());

  return <DashboardPage initialArticles={articles} />;
};

export default Dashboard;

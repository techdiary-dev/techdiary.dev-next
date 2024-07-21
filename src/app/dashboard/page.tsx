import { Metadata } from "next";
import React, { Suspense } from "react";
import DashboardPage from "./page.client";
import { ArticleApiRepository } from "@/http/repositories/article.repository";
import { cookieHeaders } from "@/utils/ssr-user";
import { Paper, Text } from "@mantine/core";
import _t from "@/i18n/_t";
import Image from "next/image";
import Link from "next/link";

export const dynamic = "force-dynamic";
export const revalidate = 1;

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

      {!Boolean(articles?.meta?.total) && (
        <div className="p-4 mt-6 border-2 border-dashed app-border-color">
          <Image
            className="mx-auto lg:w-4/12"
            src="/images/fabulous-late-night-working.png"
            width={1200}
            height={1200}
            alt={""}
          />

          <h3 className="my-6 text-xl font-semibold text-center text-dark-secondary">
            {_t("You didn't write any article yet")}
          </h3>

          <div className="flex justify-center space-x-4">
            <Link
              href={"/dashboard/articles/new"}
              className="flex items-center px-2 py-1 space-x-1 text-white rounded bg-slate-800"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                  clip-rule="evenodd"
                />
              </svg>
              <span>{_t("New diary")}</span>
            </Link>
          </div>
        </div>
      )}

      <Suspense fallback={<h1>Loading....</h1>}>
        <DashboardPage initialArticles={articles} />
      </Suspense>
    </div>
  );
};

export default Dashboard;

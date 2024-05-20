import { http } from "@/clients/http.client";
import BaseLayout from "@/components/layout/BaseLayout";
import { IArticleDetail } from "@/models/Article.model";
import { markdownToHtml } from "@/utils/markdoc-parser";
import { NextPage } from "next";
import Link from "next/link";

interface ArticleDetailsPageProps {
  params: {
    username: string;
    articleslug: string;
  };
}

const ArticleDetailsPage: NextPage<ArticleDetailsPageProps> = async ({
  params,
}) => {
  const {
    data: { data: article },
  } = await http.get<{ data: IArticleDetail }>(
    `/api/articles/slug/${params.articleslug}`
  );

  const html = markdownToHtml(article?.body?.markdown || "");

  return (
    <BaseLayout>
      <div className="relative overflow-hidden md:py-16">
        <div className="relative max-w-3xl px-4 mx-auto sm:px-6 lg:px-8">
          <div className="-ml-20 -mr-20" v-if="article.thumbnail">
            <img src={article.thumbnail} className="rounded-lg" />
          </div>

          <div className="mx-auto my-3 text-lg md:my-10 max-w-prose">
            {!article.isPublished && (
              <div className="p-4 bg-red-100 border border-red-500 border-dashed rounded-md text-slate-700">
                <div className="flex items-center space-x-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 h-6"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  <p className="font-semibold">দৃষ্টি আকর্ষন</p>
                </div>

                <p>
                  এই আর্টিক্যাল টি হোম পেইজে দৃশ্যমান নয়। কিন্তু URL টি পাবলিক,
                  অর্থাৎ আপনি চাইলে URL কপি করে যে কারো সাথে শেয়ার করতে পারবেন।
                </p>
              </div>
            )}

            <h1 className="block mt-2 text-xl font-semibold leading-10 tracking-tight text-left text-gray-900 md:text-center md:text-3xl dark:text-gray-200 sm:text-4xl">
              {article?.title}
            </h1>

            <p className="text-base md:text-center md:text-lg text-dark-secondary dark:text-gray-400">
              {/* {article?.created_at.toISOString()} */}
            </p>
          </div>

          <div className="flex items-center justify-between">
            <Link
              href={`/@${article.user.username}`}
              className="flex items-center space-x-3 text-dark"
            >
              <img
                className="w-10 h-10 rounded-full"
                src={article.user.profilePhoto}
                alt={article.user.username}
              />
              <p className="text-base md:text-xl">{article?.user?.name}</p>
            </Link>
            <div className="flex items-center space-x-2">
              {/* <nuxt-link
                        v-if="
                            $auth.loggedIn && article.user.id === $auth.user.id
                        "
                        className="font-semibold"
                        :to="{
                            name: 'dashboard-diaries-edit-id',
                            params: { id: article.id },
                        }"
                    >
                        ইডিট করুন
                    </nuxt-link> */}

              {/* <button @click="bookmark('ARTICLE', article.id)">
                        <svg
                            viewBox="0 0 14 18"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-4"
                            :className="{
                                'text-dark-secondary': !isBookmarked,
                                'fill-current text-primary': isBookmarked,
                            }"
                        >
                            <path
                                d="M1.83354 1.28697C1.52462 1.63079 1.35107 2.0971 1.35107 2.58333V17.25L7.11647 14.0417L12.8819 17.25V2.58333C12.8819 2.0971 12.7083 1.63079 12.3994 1.28697C12.0905 0.943154 11.6715 0.75 11.2346 0.75H2.99833C2.56145 0.75 2.14246 0.943154 1.83354 1.28697Z"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                className="stroke-current"
                            ></path>
                        </svg>
                    </button> */}

              {/* <share-button :url="article.url" /> */}

              {/* Actions start  */}
              <div className="vote">
                {/* <button
                            className="vote__button vote__button--upvote"
                            @click="upVote('ARTICLE', article.id)"
                            :className="{ 'vote__button--active': isUpvotted }"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-4 h-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M5 15l7-7 7 7"
                                />
                            </svg>
                            <span>{{ votes.score }}</span>
                        </button> */}

                {/* <button
                            className="vote__button vote__button--downvote"
                            :className="{ 'vote__button--active': isDownvotted }"
                            @click="downVote('ARTICLE', article.id)"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-4 h-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M19 9l-7 7-7-7"
                                />
                            </svg>
                        </button> */}
              </div>
            </div>
          </div>

          <div
            className="mx-auto mt-6 content-typography"
            dangerouslySetInnerHTML={{ __html: html }}
          ></div>

          <div className="my-10">
            {/* <comments model_name="ARTICLE" :model_id="article.id" /> */}
          </div>
        </div>
      </div>
    </BaseLayout>
  );
};

export default ArticleDetailsPage;

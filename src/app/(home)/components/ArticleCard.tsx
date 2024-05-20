"use client";

import { IArticleFeedItem } from "@/models/Article.model";
import Link from "next/link";
import React from "react";

interface ArticleCardProps {
  article: IArticleFeedItem;
}
const ArticleCard: React.FC<ArticleCardProps> = ({ article }) => {
  return (
    <article>
      <Link
        href={`@${article?.user?.username}/${article?.slug}`}
        className="article-card__title"
      >
        {article?.title}
      </Link>
      <div className="article-card__thumbnail">
        <Link href={`@${article?.user?.username}/${article?.slug}`}>
          <div className="inline-block w-full overflow-hidden rounded-md">
            <img
              width={1200}
              height={630}
              src={article.thumbnail || "/images/placeholder.png"}
              alt={article.title}
              className="w-full"
            />
          </div>
        </Link>
      </div>

      <div className="article-card__content">
        <a
          href={`@${article?.user?.username}/${article?.slug}`}
          className="article-card__excerpt"
        >
          {article?.excerpt}
        </a>
        <div className="article-card__tags"></div>
        <div className="mt-2 flex items-center space-x-4">
          <div className="vote">
            {/* <button
              className={classNames("vote__button vote__button--upvote", {
                "vote__button--active": voteState.up_voters?.includes(
                  sessionUser?.id!
                ),
              })}
              onClick={() => makeVote("UP_VOTE")}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="h-4 w-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 15l7-7 7 7"
                ></path>
              </svg>
              <span>{voteState.score}</span>
            </button> */}
            {/* <button
              className={classNames("vote__button vote__button--downvote", {
                "vote__button--active": voteState.down_voters?.includes(
                  sessionUser?.id!
                ),
              })}
              onClick={() => makeVote("DOWN_VOTE")}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="h-4 w-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                ></path>
              </svg>
            </button> */}
          </div>
          <p className="flex items-center space-x-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="h-5 w-5 text-gray-500"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
              ></path>
            </svg>
            <span>{9}</span>
          </p>
        </div>
      </div>
    </article>
  );
};

export default ArticleCard;

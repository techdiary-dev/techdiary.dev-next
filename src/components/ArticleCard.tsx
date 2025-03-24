"use client";

import { useTranslation } from "@/i18n/use-translation";
import Link from "next/link";
import React, { useMemo } from "react";

interface ArticleCardProps {
  id: string;
  title: string;
  handle: string;
  excerpt: string;
  coverImage?: string;
  author: {
    name: string;
    avatar: string;
    username: string;
  };
  publishedAt: string;
  readingTime: number;
  likes: number;
  comments: number;
}

const ArticleCard = ({
  id,
  title,
  handle,
  excerpt,
  coverImage,
  author,
  publishedAt,
  readingTime,
  likes,
  comments,
}: ArticleCardProps) => {
  const { lang } = useTranslation();

  const articleUrl = useMemo(() => {
    return `/${author.username}/${handle}`;
  }, [author.username, handle]);

  return (
    <div data-article-id={id} className="flex flex-col p-4 sm:p-5 group">
      <div className="mb-4 flex items-center">
        <div className="relative rounded-full overflow-hidden border border-neutral-200 bg-neutral-100 transition-transform duration-300 w-8 h-8 opacity-100">
          <img
            src={author.avatar}
            alt={author.name}
            className="w-full h-full object-cover transition-opacity duration-300 ease-in-out opacity-100"
          />
        </div>
        <div className="ml-2.5">
          <Link
            href={`/${author.username}`}
            className="text-sm font-medium text-foreground"
          >
            {author.name}
          </Link>
          <div className="flex items-center text-xs text-muted-foreground">
            <time dateTime={publishedAt}>
              {new Date(publishedAt).toLocaleDateString(
                lang == "bn" ? "bn-BD" : "en-US",
                {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                }
              )}
            </time>
            <span className="mx-1.5">·</span>
            <span>{readingTime} min read</span>
          </div>
        </div>
      </div>
      <div className="flex flex-1 flex-col">
        <div className="flex flex-col space-y-2 mb-3">
          <Link
            href={articleUrl}
            className="text-lg font-bold text-foreground group-hover:text-primary group-hover:underline transition-colors duration-200"
          >
            {title}...
          </Link>
          <p className="text-sm text-muted-foreground">
            {excerpt} [<Link href={articleUrl}>Read more</Link>]
          </p>
        </div>

        {coverImage && (
          <div className="relative mt-4 overflow-hidden rounded-md aspect-[16/9]">
            <img
              src={coverImage}
              alt={title}
              className="h-full w-full object-cover transition-all duration-700 opacity-100 scale-100"
            />
          </div>
        )}
      </div>
      {/* <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-1.5 text-sm text-neutral-500 transition-all duration-300 hover:text-neutral-800 focus:outline-none">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={24}
              height={24}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-heart h-4 w-4 transition-all duration-300"
            >
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
            </svg>
            <span className="text-xs font-medium">{likes}</span>
          </button>
          <button className="flex items-center gap-1.5 text-sm text-neutral-500 transition-all duration-300 hover:text-neutral-800">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={24}
              height={24}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-message-square h-4 w-4"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            <span className="text-xs font-medium">{comments}</span>
          </button>
        </div>
        <button className="text-neutral-400 hover:text-neutral-800 transition-colors duration-300">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={24}
            height={24}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-bookmark h-4 w-4"
          >
            <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
          </svg>
        </button>
      </div> */}
    </div>
  );
};

export default ArticleCard;

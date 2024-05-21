"use client";

import { useClipboard, useSetState } from "@mantine/hooks";

import useShare from "@/hooks/useShare";
import { notifications } from "@mantine/notifications";

import { relativeTime } from "@/utils/relativeTime";
import { HoverCard, Menu } from "@mantine/core";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import React from "react";
import { AiFillFacebook } from "react-icons/ai";
import { FaBookmark, FaRegBookmark } from "react-icons/fa";
import { FiCopy } from "react-icons/fi";
import { RiTwitterFill } from "react-icons/ri";

import useVote from "@/hooks/useVote";
import classNames from "clsx";

import { IArticleFeedItem } from "@/http/models/Article.model";
import { BookmarkRepository } from "@/http/repositories/bookmark.repository";
import { userAtom } from "@/store/user.atom";
import { useAtomValue } from "jotai";
import UserHoverCard from "@/components/UserHoverCard";

interface Props {
  article: IArticleFeedItem;
}

const ArticleCard: React.FC<Props> = ({ article }) => {
  const bookmarkRepository = new BookmarkRepository();
  const currentUser = useAtomValue(userAtom);
  const clipboard = useClipboard({ timeout: 100 });

  const [state, setState] = useSetState({
    bookmarked_users: article?.bookmarked_users,
  });

  const toogleBookmarkState = (bookmarked?: boolean) => {
    if (state.bookmarked_users?.includes(currentUser?.id!)) {
      setState({
        bookmarked_users: state.bookmarked_users?.filter(
          (id) => id !== currentUser?.id!
        ),
      });
    } else {
      setState({
        bookmarked_users: [...state.bookmarked_users, currentUser?.id!],
      });
    }
  };

  const { mutate: mutate__createBookmark } = useMutation({
    mutationFn: (id: string) => {
      toogleBookmarkState();
      return bookmarkRepository.createBook({
        model_name: "ARTICLE",
        model_id: id,
      });
    },
    onSuccess: (res) => {
      if (res?.data?.bookmarked) {
        setState({
          bookmarked_users: [...state.bookmarked_users, currentUser?.id!],
        });
      } else {
        setState({
          bookmarked_users: state.bookmarked_users?.filter(
            (id) => id !== currentUser?.id!
          ),
        });
      }
    },
  });

  const { share } = useShare(article.url);
  const { voteState } = useVote({
    modelName: "ARTICLE",
    id: article.id,
    data: article.votes,
  });

  return (
    <article>
      <div className="mb-[10px] flex h-12 items-center justify-between">
        {/*  */}
        <HoverCard width={280} shadow="md">
          <div className="flex items-center space-x-2">
            <div className="inline-block h-10 w-10 overflow-hidden rounded-full">
              <HoverCard.Target>
                <Link href={`/@${article?.user?.username}`}>
                  <img
                    height={40}
                    width={40}
                    src={article?.user?.profilePhoto}
                    alt={article?.user?.username}
                    className="w-full"
                  />
                </Link>
              </HoverCard.Target>
            </div>

            <HoverCard.Dropdown>
              <UserHoverCard user={article?.user} />
            </HoverCard.Dropdown>

            <div>
              <HoverCard.Target>
                <Link
                  href={`@${article?.user?.username}`}
                  className="text-dark-secondary font-mono text-base"
                >
                  {article?.user?.username}
                </Link>
              </HoverCard.Target>
              <p className="text-dark-secondary text-xs">
                {relativeTime(new Date(article?.created_at))}
              </p>
            </div>
          </div>
        </HoverCard>
        {/*  */}

        <div className="space-x-3">
          {/* Bookmark button */}
          <button onClick={() => mutate__createBookmark(article.id)}>
            {state.bookmarked_users?.includes(currentUser?.id!) ? (
              <FaBookmark />
            ) : (
              <FaRegBookmark />
            )}
          </button>

          <Menu shadow="md" width={200}>
            <Menu.Target>
              <button className="relative">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="w-5 text-gray-700"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                  ></path>
                </svg>
              </button>
            </Menu.Target>

            <Menu.Dropdown>
              <Menu.Item
                leftSection={
                  <AiFillFacebook size={22} className="text-gray-700" />
                }
                component="button"
                onClick={() => share("facebook")}
              >
                ফেসবুকে শেয়ার করুন
              </Menu.Item>
              <Menu.Item
                leftSection={
                  <RiTwitterFill size={22} className="text-gray-700" />
                }
                component="button"
                onClick={() => share("twitter")}
              >
                টুইটার শেয়ার করুন
              </Menu.Item>
              <Menu.Item
                leftSection={<FiCopy size={22} className="text-gray-700" />}
                component="button"
                onClick={() => {
                  clipboard.copy(article.url);
                  notifications.show({
                    message: "লিংক কপি করা হয়েছে",
                    icon: <FiCopy size={18} />,
                  });
                }}
              >
                লিংক কপি করুন
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </div>
      </div>
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
              src={article.thumbnail}
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
            <button
              className={classNames("vote__button vote__button--upvote", {
                "vote__button--active": voteState.up_voters?.includes(
                  currentUser?.id!
                ),
              })}
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
            </button>
            <button
              className={classNames("vote__button vote__button--downvote", {
                "vote__button--active": voteState.down_voters?.includes(
                  currentUser?.id!
                ),
              })}
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
            </button>
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
            <span>{article?.comments_count}</span>
          </p>
        </div>
      </div>
    </article>
  );
};

export default ArticleCard;

"use client";

import { useClipboard, useSetState } from "@mantine/hooks";

import useShare from "@/hooks/useShare";
import { notifications } from "@mantine/notifications";

import { relativeTime } from "@/utils/relativeTime";
import { HoverCard, Menu, Text } from "@mantine/core";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import React, { useTransition } from "react";
import { AiFillFacebook } from "react-icons/ai";
import { LiaCommentsSolid } from "react-icons/lia";
import { FiCopy } from "react-icons/fi";
import { RiTwitterFill } from "react-icons/ri";

import useVote from "@/hooks/useVote";
import classNames from "clsx";

import { IArticleFeedItem } from "@/http/models/Article.model";
import { BookmarkRepository } from "@/http/repositories/bookmark.repository";
import { userAtom } from "@/store/user.atom";
import { useAtomValue } from "jotai";
import UserHoverCard from "@/components/UserHoverCard";
import {
  BookmarkFilledIcon,
  BookmarkIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  Share2Icon,
} from "@radix-ui/react-icons";
import { fontBosonhoto } from "@/utils/fonts";
import Image from "next/image";
import { useTranslation } from "@/i18n/use-translation";

interface Props {
  article: IArticleFeedItem;
}

const ArticleCard: React.FC<Props> = ({ article }) => {
  const { _t } = useTranslation();
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
              <BookmarkFilledIcon className="w-5 h-5 text-forground" />
            ) : (
              <BookmarkIcon className="w-5 h-5 text-forground" />
            )}
          </button>

          <Menu shadow="md" width={200}>
            <Menu.Target>
              <button className="relative">
                <Share2Icon className="w-5 h-5 text-forground" />
              </button>
            </Menu.Target>

            <Menu.Dropdown>
              <Menu.Item
                leftSection={
                  <AiFillFacebook size={22} className="text-forground" />
                }
                component="button"
                onClick={() => share("facebook")}
              >
                {_t("Share on Facebook")}
              </Menu.Item>
              <Menu.Item
                leftSection={
                  <RiTwitterFill size={22} className="text-forground" />
                }
                component="button"
                onClick={() => share("twitter")}
              >
                {_t("Share on Twitter")}
              </Menu.Item>
              <Menu.Item
                leftSection={<FiCopy size={22} className="text-forground" />}
                component="button"
                onClick={() => {
                  clipboard.copy(article.url);
                  notifications.show({
                    message: _t("Link copied"),
                    icon: <FiCopy size={18} />,
                  });
                }}
              >
                {_t("Copy link")}
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

      <Text my={"md"}>
        {article?.body?.excerpt}
        {"..."}

        <Link
          href={`/@${article?.user?.username}/${article?.slug}`}
          className="font-semibold hover:underline"
        >
          [পড়ুন]
        </Link>
      </Text>
      <div className="article-card__thumbnail">
        {article?.thumbnail ? (
          <Link href={`/@${article?.user?.username}/${article?.slug}`}>
            <div className="inline-block w-full overflow-hidden rounded-md">
              <Image
                width={620}
                height={280}
                src={article.thumbnail}
                alt={article.title}
                sizes="(max-width: 900px) 100vw, 900px"
                className="w-full"
                placeholder="blur"
                blurDataURL="/thumbnail-placeholder.png"
              />
            </div>
          </Link>
        ) : null}
      </div>

      <div className="article-card__content">
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
              <ChevronUpIcon className="h-4 w-4" />
              <span>{voteState.score}</span>
            </button>
            <button
              className={classNames("vote__button vote__button--downvote", {
                "vote__button--active": voteState.down_voters?.includes(
                  currentUser?.id!
                ),
              })}
            >
              <ChevronDownIcon className="h-4 w-4" />
            </button>
          </div>
          <p className="flex items-center space-x-2">
            <LiaCommentsSolid size={22} />
            <span>{article?.comments_count}</span>
          </p>
        </div>
      </div>
    </article>
  );
};

export default ArticleCard;

"use client";

import { Article } from "@/backend/models/domain-models";
import * as articleActions from "@/backend/services/article.actions";
import { useTranslation } from "@/i18n/use-translation";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  ArrowLeftIcon,
  FontBoldIcon,
  FontItalicIcon,
  GearIcon,
  HeadingIcon,
  ImageIcon,
} from "@radix-ui/react-icons";
import React, { useRef } from "react";

import { ArticleRepositoryInput } from "@/backend/services/inputs/article.input";
import { useAutoResizeTextarea } from "@/hooks/use-auto-resize-textarea";
import { useClickAway } from "@/hooks/use-click-away";
import {
  formattedRelativeTime,
  formattedTime,
  zodErrorToString,
} from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import clsx from "clsx";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import EditorCommandButton from "./EditorCommandButton";
import { useMarkdownEditor } from "./useMarkdownEditor";
import { useDebouncedCallback } from "@/hooks/use-debounced-callback";
import { markdownToHtml } from "@/utils/markdoc-parser";
import { useAppConfirm } from "../app-confirm";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { useToggle } from "@/hooks/use-toggle";
import ArticleEditorDrawer from "./ArticleEditorDrawer";

interface Prop {
  uuid?: string;
  article?: Article;
}

const ArticleEditor: React.FC<Prop> = ({ article, uuid }) => {
  const { _t, lang } = useTranslation();
  const router = useRouter();
  const [isOpenSettingDrawer, toggleSettingDrawer] = useToggle();
  const appConfig = useAppConfirm();
  const titleRef = useRef<HTMLTextAreaElement | null>(null);
  const bodyRef = useRef<HTMLTextAreaElement | null>(null);
  useAutoResizeTextarea(titleRef);
  const setDebouncedTitle = useDebouncedCallback(() => handleSaveTitle(), 1000);
  const setDebouncedBody = useDebouncedCallback(() => handleSaveBody(), 1000);

  const [editorMode, selectEditorMode] = React.useState<"write" | "preview">(
    "write"
  );
  const editorForm = useForm({
    defaultValues: {
      title: article?.title || "",
      body: article?.body || "",
    },
    resolver: zodResolver(ArticleRepositoryInput.updateArticleInput),
  });

  const editor = useMarkdownEditor({ ref: bodyRef });

  const updateMyArticleMutation = useMutation({
    mutationFn: (
      input: z.infer<typeof ArticleRepositoryInput.updateMyArticleInput>
    ) => {
      return articleActions.updateMyArticle(input);
    },
    onSuccess: () => {
      router.refresh();
    },
    onError(err) {
      alert(err.message);
    },
  });

  const articleCreateMutation = useMutation({
    mutationFn: (
      input: z.infer<typeof ArticleRepositoryInput.createMyArticleInput>
    ) => articleActions.createMyArticle(input),
    onSuccess: (res) => {
      router.push(`/dashboard/articles/${res?.id}`);
    },
    onError(err) {
      alert(err.message);
    },
  });

  const handleSaveTitle = () => {
    if (!uuid) {
      if (editorForm.watch("title")) {
        articleCreateMutation.mutate({
          title: editorForm.watch("title") ?? "",
        });
      }
    }

    if (uuid) {
      if (editorForm.watch("title")) {
        updateMyArticleMutation.mutate({
          article_id: uuid,
          title: editorForm.watch("title") ?? "",
        });
      }
    }
  };

  const handleSaveBody = () => {
    // if (!uuid) {
    //   if (editorForm.watch("body")) {
    //     articleCreateMutation.mutate({
    //       title: editorForm.watch("body") ?? "",
    //     });
    //   }
    // }

    if (uuid) {
      if (editorForm.watch("body")) {
        updateMyArticleMutation.mutate({
          article_id: uuid,
          body: editorForm.watch("body") ?? "",
        });
      }
    }
  };

  return (
    <>
      <div className="flex bg-background gap-2 items-center justify-between mt-2 mb-10 sticky z-30 p-5">
        <div className="flex items-center gap-2 text-sm text-forground-muted">
          <div className="flex gap-4 items-center">
            <Link href={"/dashboard"} className=" text-forground">
              <ArrowLeftIcon width={20} height={20} />
            </Link>
            {updateMyArticleMutation.isPending ? (
              <p>{_t("Saving")}...</p>
            ) : (
              <p>
                {article?.updated_at && (
                  <span>
                    ({_t("Saved")} {formattedTime(article?.updated_at, lang)})
                  </span>
                )}
              </p>
            )}
          </div>

          {uuid && (
            <p
              className={clsx("px-2 py-1 text-foreground", {
                "bg-green-100": article?.is_published,
                "bg-red-100": !article?.is_published,
              })}
            >
              {article?.is_published ? (
                <span className="text-success">{_t("Published")}</span>
              ) : (
                <span className="text-destructive">{_t("Draft")}</span>
              )}
            </p>
          )}
        </div>

        {uuid && (
          <div className="flex gap-2">
            <button
              onClick={() =>
                selectEditorMode(editorMode === "write" ? "preview" : "write")
              }
              className="px-4 py-1 hidden md:block font-semibold transition-colors duration-200 rounded-sm hover:bg-muted"
            >
              {editorMode === "write" ? _t("Preview") : _t("Editor")}
            </button>

            <button
              onClick={() => {
                appConfig.show({
                  title: _t("Are you sure?"),
                  labels: {
                    confirm: _t("Yes"),
                    cancel: _t("No"),
                  },
                  onConfirm: () => {
                    updateMyArticleMutation.mutate({
                      article_id: uuid,
                      is_published: !article?.is_published,
                    });
                  },
                });
              }}
              className={clsx(
                "transition-colors hidden md:block duration-200 px-4 py-1 font-semibold cursor-pointer",
                {
                  "bg-success text-success-foreground": !article?.is_published,
                  "text-destructive text-destructive-foreground":
                    article?.is_published,
                }
              )}
            >
              {article?.is_published ? _t("Unpublish") : _t("Publish")}
            </button>
            <button onClick={() => toggleSettingDrawer()}>
              <GearIcon className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {/* Editor */}
      <div className="max-w-[750px] mx-auto p-4 md:p-0">
        <textarea
          placeholder={_t("Title")}
          tabIndex={1}
          autoFocus
          value={editorForm.watch("title")}
          className="w-full text-2xl focus:outline-none bg-background resize-none"
          ref={titleRef}
          onBlur={() => handleSaveTitle()}
          onChange={(e) => {
            editorForm.setValue("title", e.target.value);
            setDebouncedTitle(e.target.value);
          }}
        />

        {/* Editor Toolbar */}
        <div className="flex flex-col justify-between md:items-center md:flex-row">
          <div className="flex w-full gap-6 p-2 my-2 bg-muted">
            <EditorCommandButton
              onClick={() => editor?.executeCommand("heading")}
              Icon={<HeadingIcon />}
            />
            <EditorCommandButton
              onClick={() => editor?.executeCommand("bold")}
              Icon={<FontBoldIcon />}
            />
            <EditorCommandButton
              onClick={() => editor?.executeCommand("italic")}
              Icon={<FontItalicIcon />}
            />
            <EditorCommandButton
              onClick={() => editor?.executeCommand("image")}
              Icon={<ImageIcon />}
            />
          </div>
        </div>

        {/* Editor Textarea */}
        <div className="w-full">
          {editorMode === "write" ? (
            <textarea
              tabIndex={2}
              className="focus:outline-none h-[calc(100vh-120px)] bg-background w-full resize-none"
              placeholder={_t("Write something stunning...")}
              ref={bodyRef}
              value={editorForm.watch("body")}
              onChange={(e) => {
                console.log({ value: e.target.value });
                editorForm.setValue("body", e.target.value);
                setDebouncedBody(e.target.value);
              }}
            ></textarea>
          ) : (
            <div
              className="content-typography"
              dangerouslySetInnerHTML={{
                __html: markdownToHtml(editorForm.watch("body") ?? ""),
              }}
            />
          )}
        </div>
      </div>

      {uuid && (
        <ArticleEditorDrawer
          article={article!}
          open={isOpenSettingDrawer}
          onClose={toggleSettingDrawer}
          onSave={function (): void {
            throw new Error("Function not implemented.");
          }}
        />
      )}
    </>
  );
};

export default ArticleEditor;

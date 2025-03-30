"use client";

import { Article } from "@/backend/models/domain-models";
import { useTranslation } from "@/i18n/use-translation";
import {
  ArrowLeftIcon,
  FontBoldIcon,
  FontItalicIcon,
  GearIcon,
  HeadingIcon,
  ImageIcon,
} from "@radix-ui/react-icons";
import React from "react";

import EditorCommandButton from "./EditorCommandButton";
import { useMarkdownEditor } from "./useMarkdownEditor";
import clsx from "clsx";
import Link from "next/link";

interface Prop {
  uuid?: string;
  article?: Article;
}

const ArticleEditor: React.FC<Prop> = ({ article, uuid }) => {
  const { _t } = useTranslation();

  const [editorMode, selectEditorMode] = React.useState<"write" | "preview">(
    "write"
  );

  const editor = useMarkdownEditor({ value: article?.body ?? "" });

  return (
    <>
      <div className="flex bg-background gap-2 items-start justify-between mt-2 mb-10 sticky z-30 p-5">
        {uuid && (
          <div className="flex items-center gap-2 text-sm text-forground-muted">
            <div className="flex gap-4 items-center">
              <Link href={"/dashboard"} className=" text-forground">
                <ArrowLeftIcon width={20} height={20} />
              </Link>
              {/* {articleUpdateMutation.isPending ? (
                <p>{_t("Saving")}...</p>
              ) : (
                <p>
                  {article?.updated_at && (
                    <span>
                      (Saved {formatDistanceToNow(article?.updated_at)})
                    </span>
                  )}
                </p>
              )} */}
            </div>

            <p
              className={clsx("px-2 py-1", {
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
          </div>
        )}

        {uuid && (
          <div className="flex gap-2">
            <button
              onClick={() =>
                selectEditorMode(editorMode === "write" ? "preview" : "write")
              }
              className="px-4 py-1 font-semibold transition-colors duration-200 rounded-sm hover:bg-muted"
            >
              {editorMode === "write" ? _t("Preview") : _t("Editor")}
            </button>

            <button
              onClick={() => {
                //
              }}
              className={clsx(
                "hover:bg-muted transition-colors duration-200 px-4 py-1 font-semibold",
                {
                  "text-success": !article?.is_published,
                  "text-destructive": article?.is_published,
                }
              )}
            >
              {article?.is_published ? _t("Unpublish") : _t("Publish")}
            </button>
            <button
              onClick={() => {
                // drawerOpenHandler.toggle();
              }}
            >
              <GearIcon className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {/* Editor */}
      <div className="max-w-[750px] mx-auto p-4 md:p-0">
        <input
          placeholder={_t("Title")}
          tabIndex={1}
          autoFocus
          className="w-full text-2xl focus:outline-none bg-background"
        />

        {/* Editor Toolbar */}
        <div className="flex flex-col justify-between md:items-center md:flex-row">
          <div className="flex w-full gap-6 p-2 my-2 bg-muted">
            <EditorCommandButton
              onClick={() => editor.executeCommand("heading")}
              Icon={<HeadingIcon />}
            />
            <EditorCommandButton
              onClick={() => editor.executeCommand("bold")}
              Icon={<FontBoldIcon />}
            />
            <EditorCommandButton
              onClick={() => editor.executeCommand("italic")}
              Icon={<FontItalicIcon />}
            />
            <EditorCommandButton
              onClick={() => editor.executeCommand("image")}
              Icon={<ImageIcon />}
            />
          </div>
        </div>

        {/* Editor Textarea */}
        <div className="w-full">
          {editorMode === "write" ? (
            <textarea
              tabIndex={2}
              className="focus:outline-none h-[calc(100vh-120px)] bg-background w-full"
              placeholder={_t("Write something stunning...")}
              ref={editor.ref}
              value={editor.value}
              onChange={(e) => editor.setValue(e.target.value)}
            ></textarea>
          ) : (
            <div className="content-typography" />
          )}
        </div>
      </div>
    </>
  );
};

export default ArticleEditor;

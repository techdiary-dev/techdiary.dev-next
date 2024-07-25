"use client";

import AppImage from "@/components/AppImage";
import UnsplashImageGallery from "@/components/UnsplashImageGallery";
import { useClickAway } from "@/hooks/useClickAway";
import { IServerFile } from "@/http/models/AppImage.model";
import { IArticleDetail } from "@/http/models/Article.model";
import {
  ArticleApiRepository,
  CreateOrUpdateArticlePayload,
} from "@/http/repositories/article.repository";
import { FileApiRepository } from "@/http/repositories/file.repository";
import { useTranslation } from "@/i18n/use-translation";
import AppAxiosException from "@/utils/AppAxiosException";
import { markdownToHtml } from "@/utils/markdoc-parser";
import { yupResolver } from "@hookform/resolvers/yup";
import { CheckIcon, Drawer, Modal, Text } from "@mantine/core";
import { useDebouncedCallback, useDisclosure } from "@mantine/hooks";
import { openConfirmModal } from "@mantine/modals";
import { showNotification } from "@mantine/notifications";
import {
  ArrowLeftIcon,
  GearIcon,
  PlusIcon,
  TrashIcon,
} from "@radix-ui/react-icons";
import { useMutation } from "@tanstack/react-query";
import clsx from "clsx";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import {
  RiBold,
  RiHeading,
  RiImageAddFill,
  RiItalic,
  RiLink,
  RiListOrdered,
  RiListUnordered,
} from "react-icons/ri";
import {
  boldCommand,
  headingLevel2Command,
  headingLevel3Command,
  imageCommand,
  italicCommand,
  linkCommand,
  orderedListCommand,
  unorderedListCommand,
  useTextAreaMarkdownEditor,
} from "react-mde";
import * as Yup from "yup";
import EditorCommandButton from "./EditorCommandButton";
import EditorDrawer from "./EditorDrawer";

interface Prop {
  uuid?: string;
  article?: IArticleDetail;
}

const ArticleEditor: React.FC<Prop> = ({ article, uuid }) => {
  const api = new ArticleApiRepository();
  const api__files = new FileApiRepository();
  const router = useRouter();

  const articleUpdateMutation = useMutation({
    mutationFn: (data: {
      uuid: string;
      payload: CreateOrUpdateArticlePayload;
    }) => {
      return api.updateArticleByUUID(data.uuid, data.payload);
    },
    onSuccess: () => {},
    onError(error: AppAxiosException) {
      alert("Failed to update article");
      console.log(error.response?.data);
    },
  });

  const articleCreateMutation = useMutation({
    mutationFn: (payload: CreateOrUpdateArticlePayload) => {
      return api.createArticle(payload);
    },
    onSuccess: (res) => {
      router.push(`/dashboard/articles/${res?.data?.id}`);
    },
    onError(error: AppAxiosException) {
      const msg = error.response?.data?.message || "Failed to update article";
      // setErrorMsg(msg);
    },
  });

  const titleRef = useClickAway(() => {
    if (!uuid) {
      articleCreateMutation.mutate({
        title: watch("title"),
      });
    }
  });

  const debouncedState__title = useDebouncedCallback(async (title: string) => {
    if (uuid) {
      articleUpdateMutation.mutate({
        uuid,
        payload: { title },
      });
    }
  }, 500);

  const debouncedState__body = useDebouncedCallback(async (body: string) => {
    if (uuid) {
      articleUpdateMutation.mutate({
        uuid,
        payload: { body },
      });
    }
  }, 500);

  const { _t } = useTranslation();
  const [editorMode, selectEditorMode] = React.useState<"write" | "preview">(
    "write"
  );
  const [thumbnail, setThumbnail] = React.useState<IServerFile | null>(
    article?.thumbnail ? JSON.parse(article?.thumbnail as any) : null
  );
  const [drawerOpened, drawerOpenHandler] = useDisclosure(false);
  const [unsplashPickerOpened, unsplashPickerOpenHandler] =
    useDisclosure(false);

  const { setValue, watch } = useForm<IEditorForm>({
    defaultValues: {
      title: article?.title || "",
      body: article?.body?.markdown || "",
    },
    resolver: yupResolver(ArticleEditorFormValidator),
  });

  const { ref: editorTextareaRef, commandController } =
    useTextAreaMarkdownEditor({
      commandMap: {
        h2: headingLevel2Command,
        h3: headingLevel3Command,
        bold: boldCommand,
        italic: italicCommand,
        image: imageCommand,
        link: linkCommand,
        ul: unorderedListCommand,
        ol: orderedListCommand,
      },
    });

  const handleDeleteFile = async () => {
    openConfirmModal({
      title: _t("Delete file"),
      children: _t("Are you sure you want to delete this file?"),
      labels: { confirm: _t("Delete"), cancel: _t("Cancel") },
      onConfirm: async () => {
        if (thumbnail) {
          await api__files.deleteFile([thumbnail?.key]);
          if (uuid) {
            await articleUpdateMutation.mutateAsync({
              uuid,
              payload: { thumbnail: null },
            });
          }

          setThumbnail(null);
        }
      },
    });
  };

  const handleTogglePublish = async () => {
    openConfirmModal({
      title: _t(
        article?.is_published ? "Unpublish article" : "Publish article"
      ),
      children: _t(
        article?.is_published
          ? "Are you sure you want to unpublish this article?"
          : "Are you sure you want to publish this article?"
      ),
      labels: {
        confirm: article?.is_published ? _t("Unpublish") : _t("Publish"),
        cancel: _t("Cancel"),
      },
      onConfirm: async () => {
        if (uuid) {
          articleUpdateMutation
            .mutateAsync({
              uuid,
              payload: { is_published: !article?.is_published },
            })
            .finally(() => {
              router.refresh();
            });
        }
      },
    });
  };

  return (
    <>
      {/* Top Ribon */}
      <div className="flex bg-background gap-2 items-start justify-between mt-2 mb-10 sticky z-30 p-5">
        {uuid && (
          <div className="flex items-center gap-2 text-sm text-forground-muted">
            <div className="flex gap-4 items-center">
              <Link href={"/dashboard"} className=" text-forground">
                <ArrowLeftIcon width={20} height={20} />
              </Link>
              {articleUpdateMutation.isPending ? (
                <p>{_t("Saving")}...</p>
              ) : (
                <p>
                  {article?.updated_at && (
                    <span>
                      (Saved {formatDistanceToNow(article?.updated_at)})
                    </span>
                  )}
                </p>
              )}
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
              onClick={handleTogglePublish}
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
            <button onClick={() => drawerOpenHandler.toggle()}>
              <GearIcon className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {/* Editor */}
      <div className="max-w-[750px] mx-auto p-4 md:p-0">
        {/* Thumbnail Section */}
        {uuid && (
          <div className="mb-10">
            {thumbnail ? (
              <div className="relative overflow-hidden rounded-md">
                <AppImage imageSource={thumbnail} width={1200} height={630} />
                <button
                  onClick={handleDeleteFile}
                  className="absolute flex items-center p-2 rounded bg-destructive text-destructive-foreground top-10 right-10"
                >
                  <TrashIcon className="w-6 h-6" />
                  <p>{_t("Delete")}</p>
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-4 md:items-center md:flex-row">
                {/* Cover uploader button group */}
                <button className="flex items-center gap-2 text-forground-muted hover:underline hover:text-primary">
                  <PlusIcon className="w-3 h-3" />
                  <Text size="sm">{_t("Upload article cover")}</Text>
                </button>

                <button
                  className="flex items-center gap-2 text-forground-muted hover:underline hover:text-primary"
                  onClick={unsplashPickerOpenHandler.open}
                >
                  <PlusIcon className="w-3 h-3" />
                  <Text size="sm">{_t("Pick cover from unsplash")}</Text>
                </button>
              </div>
            )}
          </div>
        )}

        <input
          placeholder={_t("Title")}
          ref={titleRef}
          tabIndex={1}
          autoFocus
          value={watch("title") ?? ""}
          onChange={(e) => {
            setValue("title", e.target.value);
            debouncedState__title(e.target.value);
          }}
          className="w-full text-2xl focus:outline-none bg-background"
        />

        {/* Editor Toolbar */}
        <div className="flex flex-col justify-between md:items-center md:flex-row">
          <div className="flex w-full gap-6 p-2 my-2 bg-muted">
            <EditorCommandButton
              onClick={() => commandController.executeCommand("h2")}
              Icon={<RiHeading size={20} />}
            />

            <EditorCommandButton
              onClick={() => commandController.executeCommand("link")}
              Icon={<RiLink size={20} />}
            />

            <EditorCommandButton
              onClick={() => commandController.executeCommand("bold")}
              Icon={<RiBold size={20} />}
            />

            <EditorCommandButton
              onClick={() => commandController.executeCommand("ul")}
              Icon={<RiListUnordered size={20} />}
            />

            <EditorCommandButton
              onClick={() => commandController.executeCommand("ol")}
              Icon={<RiListOrdered size={20} />}
            />

            <EditorCommandButton
              onClick={() => commandController.executeCommand("italic")}
              Icon={<RiItalic size={20} />}
            />

            <EditorCommandButton
              onClick={() => commandController.executeCommand("image")}
              Icon={<RiImageAddFill size={20} />}
            />
          </div>
        </div>

        {/* Editor Textarea */}
        <div className="w-full">
          {editorMode === "write" ? (
            <textarea
              tabIndex={2}
              className="focus:outline-none h-[calc(100vh-120px)] bg-background w-full"
              value={watch("body") || ""}
              placeholder={_t("Write something stunning...")}
              onChange={(e) => {
                setValue("body", e.target.value);
                debouncedState__body(e.target.value);
              }}
              ref={editorTextareaRef}
            ></textarea>
          ) : (
            <div
              className="content-typography"
              dangerouslySetInnerHTML={{
                __html: markdownToHtml(watch("body") || ""),
              }}
            ></div>
          )}
        </div>
      </div>

      {/* Drawer and modal */}
      <Drawer
        opened={drawerOpened}
        onClose={() => drawerOpenHandler.close()}
        position="right"
      >
        <EditorDrawer article={article} uuid={uuid} />
      </Drawer>
      <Modal
        opened={unsplashPickerOpened}
        onClose={unsplashPickerOpenHandler.close}
        size={"100vw"}
      >
        <UnsplashImageGallery
          onUploadImage={async (image) => {
            setThumbnail(image);
            if (uuid) {
              await articleUpdateMutation.mutateAsync({
                uuid,
                payload: { thumbnail: image },
              });
            }
            unsplashPickerOpenHandler.close();
          }}
        />
      </Modal>
    </>
  );
};

export default ArticleEditor;

const ArticleEditorFormValidator = Yup.object().shape({
  title: Yup.string()
    .nullable()
    .max(255, "Title cannot exceed 255 characters")
    .label("Title"),
  body: Yup.string().nullable().label("Body"),
});

type IEditorForm = Yup.InferType<typeof ArticleEditorFormValidator>;

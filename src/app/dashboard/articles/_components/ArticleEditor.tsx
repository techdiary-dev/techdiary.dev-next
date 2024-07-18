"use client";

import AppImage from "@/components/AppImage";
import UnsplashImageGallery from "@/components/UnsplashImageGallery";
import { IServerFile } from "@/http/models/AppImage.model";
import { IArticleDetail } from "@/http/models/Article.model";
import {
  ArticleApiRepository,
  CreateOrUpdateArticlePayload,
} from "@/http/repositories/article.repository";
import { FileApiRepository } from "@/http/repositories/file.repository";
import { useTranslation } from "@/i18n/use-translation";
import AppAxiosException from "@/utils/AppAxiosException";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Alert,
  Button,
  CheckIcon,
  Drawer,
  Input,
  Modal,
  MultiSelect,
  Text,
  Textarea,
} from "@mantine/core";
import { useDebouncedCallback, useDisclosure } from "@mantine/hooks";
import { openConfirmModal } from "@mantine/modals";
import { showNotification } from "@mantine/notifications";
import {
  GearIcon,
  Link2Icon,
  PlusIcon,
  TrashIcon,
} from "@radix-ui/react-icons";
import { useMutation } from "@tanstack/react-query";
import clsx from "clsx";
import { formatDistanceToNow } from "date-fns";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
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
import { markdownToHtml } from "@/utils/markdoc-parser";
import { useClickAway } from "@/hooks/useClickAway";

interface Prop {
  uuid?: string;
  article?: IArticleDetail;
}

const ArticleEditor: React.FC<Prop> = ({ article, uuid }) => {
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
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
    onSuccess: () => {
      router.refresh();
      showNotification({
        message: _t("Article updated"),
        color: "green",
        icon: <CheckIcon />,
      });
    },
    onError(error: AppAxiosException) {
      const msg = error.response?.data?.message || "Failed to update article";
      setErrorMsg(msg);
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
      setErrorMsg(msg);
    },
  });

  const generateSlugMutation = useMutation({
    mutationFn: (data: { slug: string }) => {
      return api.getUniqueSlug(data.slug);
    },
    onSuccess: () => {
      // router.refresh();
      // showNotification({
      //   message: _t("Article slug updated"),
      //   color: "green",
      //   icon: <CheckIcon />,
      // });
    },
    onError(error: AppAxiosException) {
      // const msg = error.response?.data?.message || "Failed to update article";
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

  const { register, handleSubmit, setValue, watch } = useForm<IEditorForm>({
    defaultValues: {
      title: article?.title || "",
      body: article?.body?.markdown || "",
      slug: article?.slug || "",
      excerpt: article?.excerpt || "",
      // tags: article?.tags || [],
      // seo: article?.seo || {},
      // settings: article?.settings || {},
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

  const handleSave: SubmitHandler<IEditorForm> = async (data) => {
    console.log(data);
    if (uuid) {
      articleUpdateMutation.mutate({
        uuid,
        payload: data,
      });
    }
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
          articleUpdateMutation.mutate({
            uuid,
            payload: { is_published: !article?.is_published },
          });
        }
      },
    });
  };

  const handleOnChangeSlugDebounce = useDebouncedCallback(
    async (query: string) => {
      await generateSlugMutation.mutateAsync({ slug: query }).then((res) => {
        if (res.slug) {
          setValue("slug", res.slug);
        }
      });
    },
    2000
  );

  // const handleOnChangeSlug = async (
  //   event: React.ChangeEvent<HTMLInputElement>
  // ) => {
  //   setValue("slug", event.target.value);
  //   await generateSlugMutation
  //     .mutateAsync({ slug: event.target.value })
  //     .then((res) => {
  //       if (res.slug) {
  //         setValue("slug", res.slug);
  //       }
  //     });
  // };

  return (
    <>
      {/* <pre>{JSON.stringify(article, null, 2)}</pre> */}
      <Drawer
        opened={drawerOpened}
        onClose={() => drawerOpenHandler.close()}
        position="right"
      >
        <div className="flex flex-col gap-2">
          {errorMsg && (
            <Alert variant="filled" color="red">
              {errorMsg}
            </Alert>
          )}

          <Input.Wrapper
            label="Slug"
            description={`https://www.techdiary.dev/@${
              article?.user?.username
            }/${watch("slug")}`}
            inputWrapperOrder={["label", "input", "description"]}
          >
            <Input
              leftSection={<Link2Icon />}
              value={watch("slug") || ""}
              onChange={(e) => {
                setValue("slug", e.target.value);
                handleOnChangeSlugDebounce(e.target.value);
              }}
            />
          </Input.Wrapper>

          <Input.Wrapper label="Excerpt">
            <Textarea {...register("excerpt")} />
          </Input.Wrapper>

          <MultiSelect
            data={[]}
            label="Categories"
            placeholder="Select categories"
          />
          <div className="flex-1 h-10"></div>
          <Button
            onClick={handleSubmit(handleSave)}
            loading={articleUpdateMutation.isPending}
          >
            <span>{_t("Save")}</span>
          </Button>
        </div>
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

      {/* Top Ribon */}
      <div className="flex bg-background gap-2 items-start justify-between top-[48px] mb-10 sticky z-30 -mt-[17px] pt-[17px]">
        {uuid && (
          <div className="flex items-center gap-2 text-sm text-forground-muted">
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
              onClick={handleSubmit(handleSave)}
              className="px-4 py-1 font-semibold transition-colors duration-200 rounded-sm hover:bg-muted"
            >
              <span>{_t("Save")}</span>
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
      <div className="max-w-[750px] mx-auto">
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
          autoFocus
          value={watch("title") ?? ""}
          onChange={(e) => setValue("title", e.target.value)}
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

        <div className="w-full">
          {editorMode === "write" ? (
            <textarea
              className="focus:outline-none h-[calc(100vh-120px)] bg-background w-full"
              value={watch("body") || ""}
              onChange={(e) => setValue("body", e.target.value)}
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
    </>
  );
};

export default ArticleEditor;

const ArticleEditorFormValidator = Yup.object().shape({
  title: Yup.string()
    .nullable()
    .max(255, "Title cannot exceed 255 characters")
    .label("Title"),
  slug: Yup.string()
    .nullable()
    .max(255, "Slug cannot exceed 255 characters")
    .label("Slug"),
  excerpt: Yup.string().nullable().label("Excerpt"),
  // seriesName: Yup.string()
  //   .nullable()
  //   .min(5, "Series Name must be at least 5 characters")
  //   .max(255, "Series Name cannot exceed 255 characters")
  //   .label("Series Name"),
  // thumbnail: Yup.object()
  //   .nullable()
  //   .shape({
  //     key: Yup.string()
  //       .nullable()
  //       .max(255, "Thumbnail URL cannot exceed 255 characters")
  //       .label("Thumbnail"),
  //     provider: Yup.string()
  //       .nullable()
  //       .max(255, "Thumbnail alt cannot exceed 255 characters")
  //       .label("Thumbnail alt"),
  //   })
  //   .label("Thumbnail"),
  body: Yup.string().nullable().label("Body"),
  // tags: Yup.array().nullable().label("Tags"),
  // seo: Yup.object()
  //   .shape({
  //     og_image: Yup.string()
  //       .nullable()
  //       .url("OG Image must be a valid URL")
  //       .label("OG Image"),
  //     seo_title: Yup.string()
  //       .nullable()
  //       .max(255, "SEO Title cannot exceed 255 characters")
  //       .label("SEO Title"),
  //     seo_description: Yup.string()
  //       .nullable()
  //       .max(255, "SEO Description cannot exceed 255 characters")
  //       .label("SEO Description"),
  //     canonical_url: Yup.string()
  //       .nullable()
  //       .url("Canonical URL must be a valid URL")
  //       .max(255, "Canonical URL cannot exceed 255 characters")
  //       .label("Canonical URL"),
  //   })
  //   .nullable(),
  // settings: Yup.object()
  //   .shape({
  //     disabled_comments: Yup.boolean().nullable().label("Disabled Comments"),
  //   })
  //   .nullable(),
});

type IEditorForm = Yup.InferType<typeof ArticleEditorFormValidator>;

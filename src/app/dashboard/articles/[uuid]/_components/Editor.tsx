"use client";

import AppImage from "@/components/AppImage";
import UnsplashImageGallery from "@/components/UnsplashImageGallery";
import { IServerFile } from "@/http/models/AppImage.model";
import { IArticleDetail } from "@/http/models/Article.model";
import { ArticleApiRepository } from "@/http/repositories/article.repository";
import { useTranslation } from "@/i18n/use-translation";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Drawer,
  Input,
  Modal,
  MultiSelect,
  Switch,
  Text,
  Textarea,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { openConfirmModal } from "@mantine/modals";
import { GearIcon, PlusIcon, TrashIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
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
import clsx from "clsx";

interface Prop {
  uuid: string;
  article?: IArticleDetail;
}

const ArticleEditor: React.FC<Prop> = ({ article, uuid }) => {
  const api = new ArticleApiRepository();
  const router = useRouter();

  const { _t } = useTranslation();
  const [mode, selectMode] = React.useState<"write" | "preview">("write");
  const [thumbnail, setThumbnail] = React.useState<IServerFile | null>(null);
  const [drawerOpened, drawerOpenHandler] = useDisclosure(false);
  const [unsplashPickerOpened, unsplashPickerOpenHandler] =
    useDisclosure(false);

  const { register, handleSubmit, setValue, watch } = useForm<IEditorForm>({
    defaultValues: {
      title: article?.title || " ",
      body: article?.body?.markdown || "",
      // excerpt: article?.excerpt || " ",
      // isPublished: article?.isPublished || false,
      // // seriesName: article?.seriesName || " ",
      // thumbnail: article?.thumbnail || " ",
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
      onConfirm: () => {
        if (thumbnail) {
          // deleteFile(thumbnail.key);
          // setThumbnail(null);
        }
      },
    });
    // if (thumbnail) {
    //   await deleteFile(thumbnail.key);
    //   setThumbnail(null);
    // }
  };

  const handleSave: SubmitHandler<IEditorForm> = async (data) => {
    console.log(data);
    await api.updateArticleByUUID(uuid, data);
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
        await api.updateArticleByUUID(uuid, {
          is_published: !article?.is_published,
        });
        router.refresh();
      },
    });
  };

  return (
    <>
      {/* <pre>{JSON.stringify(article, null, 2)}</pre> */}
      <Drawer
        opened={drawerOpened}
        onClose={() => drawerOpenHandler.close()}
        position="right"
      >
        <div className="flex flex-col gap-2">
          {/* <ThumbnailUploader
            url={watch("thumbnail") || ""}
            onChange={function (url: string) {
              setValueHook("thumbnail", url, { shouldValidate: true });
              console.log({ url });
            }}
          /> */}

          <Input.Wrapper label="Handle">
            <Input />
          </Input.Wrapper>

          <Input.Wrapper label="Excerpt">
            <Textarea />
          </Input.Wrapper>

          <MultiSelect
            data={[]}
            label="Categories"
            placeholder="Select categories"
          />

          <Switch label="Published" />
        </div>
      </Drawer>
      <Modal
        opened={unsplashPickerOpened}
        onClose={unsplashPickerOpenHandler.close}
        size={"100vw"}
      >
        <UnsplashImageGallery
          onUploadImage={(image) => {
            setThumbnail(image);
            unsplashPickerOpenHandler.close();
          }}
        />
      </Modal>

      {/* Top Ribon */}
      <div className="flex gap-2 justify-between items-center mb-10">
        <div className="text-forground-muted text-sm">(Saved 3 mins ago)</div>
        <div className="flex gap-4">
          <button>{_t("Preview")}</button>
          <button
            onClick={handleSubmit(handleSave)}
            className="text-green-500 bg-muted px-4 py-1"
          >
            {_t("Save")}
          </button>

          <button
            onClick={handleTogglePublish}
            className={clsx("bg-muted px-4 py-1", {
              "text-success": !article?.is_published,
              "text-destructive": article?.is_published,
            })}
          >
            {article?.is_published ? _t("Unpublish") : _t("Publish")}
          </button>

          <button onClick={() => drawerOpenHandler.toggle()}>
            <GearIcon className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="max-w-[750px] mx-auto">
        {/* Thumbnail Section */}
        <div className="mb-10">
          {thumbnail ? (
            <div className="rounded-md overflow-hidden relative">
              <AppImage imageSource={thumbnail} width={1200} height={630} />
              <button
                onClick={handleDeleteFile}
                className="flex items-center rounded bg-destructive text-destructive-foreground z-30 absolute top-10 right-10 p-2"
              >
                <TrashIcon className="w-6 h-6" />
                <p>{_t("Delete")}</p>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
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

        <input
          placeholder={_t("Title")}
          {...register("title")}
          className=" w-full text-2xl focus:outline-none"
        />

        <div className="flex items-center justify-between flex-col md:flex-row">
          <div className="my-2 flex gap-6">
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
        <textarea
          className="h-[calc(100vh-120px)] w-full border p-3 focus:outline-none"
          value={watch("body") || ""}
          onChange={(e) => setValue("body", e.target.value)}
          ref={editorTextareaRef}
        ></textarea>
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
  excerpt: Yup.string()
    .nullable()
    .min(5, "Excerpt must be at least 5 characters")
    .max(255, "Excerpt cannot exceed 255 characters")
    .label("Excerpt"),
  // seriesName: Yup.string()
  //   .nullable()
  //   .min(5, "Series Name must be at least 5 characters")
  //   .max(255, "Series Name cannot exceed 255 characters")
  //   .label("Series Name"),
  // thumbnail: Yup.string()
  //   .nullable()
  //   .url("Thumbnail must be a valid URL")
  //   .max(255, "Thumbnail URL cannot exceed 255 characters")
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

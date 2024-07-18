import { IArticleDetail } from "@/http/models/Article.model";
import {
  ArticleApiRepository,
  CreateOrUpdateArticlePayload,
} from "@/http/repositories/article.repository";
import { useTranslation } from "@/i18n/use-translation";
import AppAxiosException from "@/utils/AppAxiosException";
import * as Yup from "yup";
import {
  Alert,
  Button,
  CheckIcon,
  Divider,
  Input,
  MultiSelect,
  Space,
  Text,
  Textarea,
  Tooltip,
} from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { Link2Icon, QuestionMarkCircledIcon } from "@radix-ui/react-icons";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDebouncedCallback } from "@mantine/hooks";

interface Prop {
  article?: IArticleDetail;
  uuid?: string;
}

const EditorDrawer: React.FC<Prop> = ({ article, uuid }) => {
  const api = new ArticleApiRepository();
  const router = useRouter();
  const { _t } = useTranslation();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
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

  const { handleSubmit, setValue, watch, register } =
    useForm<IEditorDrawerForm>({
      defaultValues: {
        slug: article?.slug || "",
        excerpt: article?.excerpt || "",
        // tags: article?.tags || [],
        seo: article?.seo || {},
        // settings: article?.settings || {},
      },
      resolver: yupResolver(ArticleEditorFormValidator),
    });

  const handleOnChangeSlugDebounce = useDebouncedCallback(
    async (slug: string) => {
      await api
        .getUniqueSlug(slug)
        .then((res) => {
          if (res.slug) {
            setValue("slug", res.slug);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    2000
  );

  const handleOnSubmit: SubmitHandler<IEditorDrawerForm> = (payload) => {
    articleUpdateMutation.mutate({
      uuid: uuid!,
      payload,
    });
  };

  return (
    <>
      <form
        onSubmit={handleSubmit(handleOnSubmit)}
        className="relative h-screen"
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

          <div className="flex w-full items-center gap-2 mt-4">
            <Text size="md">{_t("Seo Settings")}</Text>
            <Divider className="flex-1" />
          </div>

          <div className="flex flex-col gap-6">
            <Input.Wrapper
              description={
                <Text size="sm">
                  The &quot;SEO title&quot; will be shown in place of your Title
                  on search engine results pages, such as a Google search. SEO
                  titles between 40 and 50 characters with commonly searched
                  words have the best click-through-rates.
                </Text>
              }
              label={_t("SEO Title")}
            >
              <Input
                placeholder={_t("Enter seo title")}
                {...register("seo.seo_title")}
              />
            </Input.Wrapper>

            <Input.Wrapper
              label={_t("SEO Description")}
              description={
                <Text size="sm">
                  The &quot;SEO description&quot; will be used in place of your
                  Subtitle on search engine results pages. Good SEO descriptions
                  utilize keywords, summarize the article and are between
                  140-156 characters long.
                </Text>
              }
            >
              <Textarea
                placeholder={_t("Enter seo description")}
                {...register("seo.seo_description")}
              />
            </Input.Wrapper>

            <Input.Wrapper
              label={_t("Are you republishing?")}
              description={
                <Text size="sm">
                  Change the canonical URL of this article to the original
                  article
                </Text>
              }
            >
              <Input
                leftSection={<Link2Icon />}
                placeholder={_t("Canonical URL")}
                {...register("seo.canonical_url")}
                type="url"
              />
            </Input.Wrapper>
          </div>

          <Divider className="my-4" />
        </div>

        <div className="my-4">
          <Button type="submit" loading={articleUpdateMutation.isPending}>
            <span>{_t("Save")}</span>
          </Button>
        </div>
      </form>
    </>
  );
};

export default EditorDrawer;

const ArticleEditorFormValidator = Yup.object().shape({
  slug: Yup.string()
    .nullable()
    .max(255, "Slug cannot exceed 255 characters")
    .label("Slug"),
  excerpt: Yup.string().nullable().label("Excerpt"),

  // tags: Yup.array().nullable().label("Tags"),
  seo: Yup.object()
    .shape({
      // og_image: Yup.string()
      //   .nullable()
      //   .url("OG Image must be a valid URL")
      //   .label("OG Image"),
      seo_title: Yup.string()
        .nullable()
        .max(255, "SEO Title cannot exceed 255 characters")
        .label("SEO Title"),
      seo_description: Yup.string()
        .nullable()
        .max(160, "SEO Description cannot exceed 255 characters")
        .label("SEO Description"),
      canonical_url: Yup.string()
        .nullable()
        .url("Canonical URL must be a valid URL")
        .max(255, "Canonical URL cannot exceed 255 characters")
        .label("Canonical URL"),
    })
    .nullable(),
  // settings: Yup.object()
  //   .shape({
  //     disabled_comments: Yup.boolean().nullable().label("Disabled Comments"),
  //   })
  //   .nullable(),
});

type IEditorDrawerForm = Yup.InferType<typeof ArticleEditorFormValidator>;

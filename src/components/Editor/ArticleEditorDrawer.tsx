"use client";

import { Article } from "@/backend/models/domain-models";
import * as articleActions from "@/backend/services/article.actions";
import { ArticleRepositoryInput } from "@/backend/services/inputs/article.input";
import MultipleSelector, { Option } from "@/components/ui/multi-select";
import { useDebouncedCallback } from "@/hooks/use-debounced-callback";
import { useTranslation } from "@/i18n/use-translation";
import { useSession } from "@/store/session.atom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { LinkIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { InputTags } from "../ui/input-tags";
import { Sheet, SheetContent } from "../ui/sheet";
import { Textarea } from "../ui/textarea";

interface Props {
  article: Article;
  open: boolean;
  onClose: () => void;
  onSave: () => void;
}
const ArticleEditorDrawer: React.FC<Props> = ({ article, open, onClose }) => {
  const session = useSession();
  const { _t } = useTranslation();
  const router = useRouter();
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

  const setDebounceHandler = useDebouncedCallback(async (slug: string) => {
    const handle = await articleActions.getUniqueArticleHandle(slug);
    form.setValue("handle", handle);
    updateMyArticleMutation.mutate({
      article_id: article?.id ?? "",
      handle: handle,
    });
  }, 2000);

  const form = useForm<
    z.infer<typeof ArticleRepositoryInput.updateMyArticleInput>
  >({
    defaultValues: {
      article_id: article.id,
      title: article?.title ?? "",
      handle: article?.handle ?? "",
      excerpt: article?.excerpt ?? "",
      metadata: {
        seo: {
          title: article?.metadata?.seo?.title ?? "",
          description: article?.metadata?.seo?.description ?? "",
          keywords: article?.metadata?.seo?.keywords ?? [],
          canonical_url: article?.metadata?.seo?.canonical_url ?? "",
        },
      },
    },
    resolver: zodResolver(ArticleRepositoryInput.updateMyArticleInput),
  });

  const handleOnSubmit: SubmitHandler<
    z.infer<typeof ArticleRepositoryInput.updateMyArticleInput>
  > = (payload) => {
    updateMyArticleMutation.mutate({
      article_id: article?.id ?? "",
      excerpt: payload.excerpt,
      handle: payload.handle,
      metadata: {
        seo: {
          title: payload.metadata?.seo?.title ?? "",
          description: payload.metadata?.seo?.description ?? "",
          keywords: payload.metadata?.seo?.keywords ?? [],
          canonical_url: payload.metadata?.seo?.canonical_url ?? "",
        },
      },
    });
  };

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent>
        <div className="p-4 overflow-y-auto">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleOnSubmit)}
              className="flex flex-col gap-2"
            >
              {JSON.stringify(form.formState.errors)}

              <FormField
                control={form.control}
                name="handle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{_t("Handle")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Your handle"
                        Prefix={
                          <LinkIcon className="size-3 text-muted-foreground" />
                        }
                        {...field}
                        onChange={(e) => {
                          setDebounceHandler(e.target.value);
                          form.setValue("handle", e.target.value);
                        }}
                      />
                    </FormControl>
                    <FormDescription className="-mt-1">
                      https://www.techdiary.dev/@{session?.user?.username}/
                      {form.watch("handle")}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/*  */}
              <FormField
                control={form.control}
                name="excerpt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{_t("Excerpt")}</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Seo settings */}
              <div className="flex flex-col gap-6 mt-10">
                <div className="flex items-center gap-1">
                  <p className="font-semibold">{_t("Seo Settings")}</p>
                  <span className="h-[1px] flex-1 bg-muted"></span>
                </div>

                <FormField
                  control={form.control}
                  name="metadata.seo.title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{_t("SEO Title")}</FormLabel>
                      <FormDescription className="text-xs">
                        The &quot;SEO title&quot; will be shown in place of your
                        Title on search engine results pages, such as a Google
                        search. SEO titles between 40 and 50 characters with
                        commonly searched words have the best
                        click-through-rates.
                      </FormDescription>
                      <FormControl>
                        <Input {...field} placeholder={form.watch("title")} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* <FormField
                  control={form.control}
                  name="metadata.seo.canonical_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{_t("Are you republishing")}?</FormLabel>
                      <FormDescription className="text-xs"></FormDescription>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                /> */}

                <FormField
                  control={form.control}
                  name="metadata.seo.keywords"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{_t("SEO Keywords")}</FormLabel>
                      <FormDescription className="text-xs">
                        Put some relevent keywords for better search engine
                        visibility.
                      </FormDescription>
                      <FormControl>
                        <MultipleSelector
                          creatable
                          maxSelected={10}
                          value={
                            field.value?.map((option) => ({
                              label: option,
                              value: option,
                            })) ?? []
                          }
                          onChange={(options) => {
                            field.onChange(
                              options.map((option) => option.value)
                            );
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="metadata.seo.description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{_t("SEO Description")}</FormLabel>
                      <FormDescription className="text-xs">
                        The &quot;SEO description&quot; will be used in place of
                        your Subtitle on search engine results pages. Good SEO
                        descriptions utilize keywords, summarize the article and
                        are between 140-156 characters long.
                      </FormDescription>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* 
                <FormField
                  control={form.control}
                  name="metadata.seo.keywords"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{_t("SEO Keywords")}</FormLabel>
                      <FormDescription className="text-xs">
                        Put some relevent keywords for better search engine
                        visibility
                      </FormDescription>
                      <FormControl>
                        <InputTags
                          value={[]}
                          onChange={(e) => {
                            console.log(e);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                /> */}
              </div>

              <Button type="submit">{_t("Save")}</Button>
            </form>
          </Form>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default ArticleEditorDrawer;

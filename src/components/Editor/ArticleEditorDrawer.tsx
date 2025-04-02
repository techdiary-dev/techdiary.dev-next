"use client";

import { Article } from "@/backend/models/domain-models";
import * as articleActions from "@/backend/services/article.actions";
import { ArticleRepositoryInput } from "@/backend/services/inputs/article.input";
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
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
} from "../ui/sheet";

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
  const setDebounceHandler = useDebouncedCallback(async (slug: string) => {
    const handle = await articleActions.getUniqueArticleHandle(slug);
    form.setValue("handle", handle);
  }, 2000);
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

  const form = useForm<
    z.infer<typeof ArticleRepositoryInput.updateMyArticleInput>
  >({
    defaultValues: {
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
  //className="m-3 h-[100vh-20px] w-[100vw-20px]"
  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent>
        <SheetHeader>
          <SheetDescription asChild>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleOnSubmit)}
                className="flex flex-col gap-2"
              >
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
                        https://www.techdiary.dev/{session?.user?.username}/
                        {form.watch("handle")}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button>{_t("Save")}</Button>
              </form>
            </Form>
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
};

export default ArticleEditorDrawer;

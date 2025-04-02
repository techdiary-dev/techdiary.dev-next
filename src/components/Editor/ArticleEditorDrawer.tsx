import { Article } from "@/backend/models/domain-models";
import * as articleActions from "@/backend/services/article.actions";
import { ArticleRepositoryInput } from "@/backend/services/inputs/article.input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
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

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="m-3 h-[100vh-20px] w-[100vw-20px]">
        <SheetHeader>
          <SheetDescription asChild>
            <form onSubmit={form.handleSubmit(handleOnSubmit)}>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </form>
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
};

export default ArticleEditorDrawer;

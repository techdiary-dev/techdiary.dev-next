import { Article } from "@/backend/models/domain-models";
import React from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "../ui/sheet";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ArticleRepositoryInput } from "@/backend/services/inputs/article.input";
import { zodResolver } from "@hookform/resolvers/zod";

interface Props {
  article: Article;
  open: boolean;
  onClose: () => void;
  onSave: () => void;
}
const ArticleEditorDrawer: React.FC<Props> = ({ article, open, onClose }) => {
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
  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="m-3 h-[100vh-20px] w-[100vw-20px]">
        <SheetHeader>
          <SheetDescription asChild>
            <form>
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

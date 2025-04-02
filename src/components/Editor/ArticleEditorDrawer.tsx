import { Article } from "@/backend/models/domain-models";
import React from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "../ui/sheet";

interface Props {
  article: Article;
  open: boolean;
  onClose: () => void;
  onSave: () => void;
}
const ArticleEditorDrawer: React.FC<Props> = ({ article, open, onClose }) => {
  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="m-3 h-[100vh-20px] w-[100vw-20px]">
        <SheetHeader>
          <SheetTitle>Are you absolutely sure?</SheetTitle>
          <SheetDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
};

export default ArticleEditorDrawer;

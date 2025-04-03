import { Article } from "@/backend/models/domain-models";
import UserInformationCard from "@/components/UserInformationCard";
import React from "react";

interface Props {
  article: Article;
}
const ArticleSidebar: React.FC<Props> = ({ article }) => {
  return (
    <div>
      <UserInformationCard userId={article?.user?.id!} />
    </div>
  );
};

export default ArticleSidebar;

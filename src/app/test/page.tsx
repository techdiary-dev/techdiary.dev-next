import { persistenceRepository } from "@/backend/persistence-repositories";
import React from "react";

const page = async () => {
  const articles = await persistenceRepository.article.findAllWithPagination({
    columns: ["id", "title"],
  });

  return (
    <div>
      <pre>{JSON.stringify(articles, null, 2)}</pre>
    </div>
  );
};

export default page;

import { getTags } from "@/backend/services/tag.action";
import React from "react";

const Page = async () => {
  const tags = await getTags({ page: 1, limit: -1 });
  return <pre className="p-10">{JSON.stringify(tags, null, 2)}</pre>;
};

export default Page;

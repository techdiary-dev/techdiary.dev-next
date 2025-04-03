"use client";

import { TagInput } from "@/components/ui/tags-input";
import React from "react";

const page = () => {
  const [tags, setTags] = React.useState<string[]>([]);
  return (
    <div className="p-10">
      <TagInput tags={tags} onTagsChange={setTags} />
    </div>
  );
};

export default page;

import Image from "next/image";
import React, { useState } from "react";
import { AiOutlineHome } from "react-icons/ai";
import { HiOutlineBookmark, HiPlus } from "react-icons/hi";
import TagsWidget from "./widgets/TagsWidget";

const HomeLeftSidebar = () => {
  return (
    <div className="flex flex-col gap-3">
      <div className="mb-2 mt-4 flex flex-col gap-4">
        <p className="flex items-center gap-2">
          <AiOutlineHome />
          <span className="text-sm">হোম</span>
        </p>
        <p className="flex items-center gap-2">
          <HiOutlineBookmark />
          <span className="text-sm">রিডিং লিস্ট</span>
        </p>
        <p className="flex items-center gap-2">
          <HiPlus />
          <span className="text-sm">নতুন ডায়েরি</span>
        </p>
      </div>

      <TagsWidget />
    </div>
  );
};

export default HomeLeftSidebar;

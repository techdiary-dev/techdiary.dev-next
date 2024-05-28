import Image from "next/image";
import React, { useState } from "react";
import { AiOutlineHome } from "react-icons/ai";
import { HiOutlineBookmark, HiPlus } from "react-icons/hi";
import TagsWidget from "./widgets/TagsWidget";
import _ts from "@/i18n/_ts";

const HomeLeftSidebar = () => {
  return (
    <div className="flex flex-col gap-3">
      <div className="mb-2 mt-4 flex flex-col gap-4">
        <p className="flex items-center gap-2">
          <AiOutlineHome />
          <span className="text-sm">{_ts("Home")}</span>
        </p>
        <p className="flex items-center gap-2">
          <HiOutlineBookmark />
          <span className="text-sm">{_ts("Bookmarks")}</span>
        </p>
        <p className="flex items-center gap-2">
          <HiPlus />
          <span className="text-sm">{_ts("New diary")}</span>
        </p>
      </div>

      <TagsWidget />
    </div>
  );
};

export default HomeLeftSidebar;

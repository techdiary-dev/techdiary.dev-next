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
          <AiOutlineHome color="#1e293b" />
          <span className="text-sm text-[#1e293b]">হোম</span>
        </p>
        <p className="flex items-center gap-2">
          <HiOutlineBookmark color="#1e293b" />
          <span className="text-sm text-[#1e293b]">রিডিং লিস্ট</span>
        </p>
        <p className="flex items-center gap-2">
          <HiPlus color="#1e293b" />
          <span className="text-sm text-[#1e293b]">নতুন ডায়েরি</span>
        </p>
      </div>

      <TagsWidget />
    </div>
  );
};

export default HomeLeftSidebar;

"use client";

import { homeSidebarOpenAtom } from "@/store/home-sidebar.atom";
import { useAtom } from "jotai";
import { MenuIcon } from "lucide-react";

const SidebarToggleButton = () => {
  const [open, setOpen] = useAtom(homeSidebarOpenAtom);

  return (
    <button className="cursor-pointer md:hidden" onClick={() => setOpen(!open)}>
      <MenuIcon />
    </button>
  );
};

export default SidebarToggleButton;

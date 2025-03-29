"use client";

import { useTranslation } from "@/i18n/use-translation";

import Link from "next/link";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import ThemeSwitcher from "./ThemeSwitcher";

import SocialLoginCard from "../SocialLoginCard";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { SearchIcon } from "lucide-react";
import { useSession } from "@/store/session.atom";
import { useAppConfirm } from "../app-confirm";
import { deleteSession } from "@/auth/auth";
import AuthenticatedUserMenu from "./AuthenticatedUserMenu";
import LanguageSwitcher from "./LanguageSwitcher";

const NavbarActions: React.FC = () => {
  const { _t } = useTranslation();
  const authSession = useSession();

  return (
    <div className="flex items-center gap-2">
      <Button variant="ghost" className="md:hidden">
        <SearchIcon size={18} />
      </Button>
      <LanguageSwitcher />
      <ThemeSwitcher />
      <Button className="hidden md:block">{_t("New diary")}</Button>

      {authSession?.session ? (
        <AuthenticatedUserMenu />
      ) : (
        <UnAuthenticatedMenu />
      )}
    </div>
  );
};

export default NavbarActions;

const UnAuthenticatedMenu = () => {
  const { _t } = useTranslation();

  return (
    <Popover>
      <PopoverTrigger>
        <Button variant={"outline"}>{_t("Login")}</Button>
      </PopoverTrigger>
      <PopoverContent>
        <SocialLoginCard />
      </PopoverContent>
    </Popover>
  );
};

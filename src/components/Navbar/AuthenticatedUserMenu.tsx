"use client";

import { useTranslation } from "@/i18n/use-translation";
import { useSession } from "@/store/session.atom";
import { useAppConfirm } from "../app-confirm";
import { deleteSession } from "@/auth/auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import Link from "next/link";

const AuthenticatedUserMenu = () => {
  const { _t } = useTranslation();
  const authSession = useSession();
  const appConfirm = useAppConfirm();

  const handleLogout = async () => {
    appConfirm.show({
      title: _t("Sure to logout?"),
      children: <p>{_t("You will be logged out after this")}</p>,
      async onConfirm() {
        await deleteSession();
        window.location.reload();
      },
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar>
          <AvatarImage src={authSession?.user?.profile_photo ?? ""} />
          <AvatarFallback>{authSession?.user?.name.charAt(0)}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem asChild>
          <Link href={`/${authSession?.user?.id}`}>{_t("My profile")}</Link>
        </DropdownMenuItem>
        <DropdownMenuItem>{_t("Dashboard")}</DropdownMenuItem>
        <DropdownMenuItem>{_t("Bookmarks")}</DropdownMenuItem>
        <DropdownMenuItem>{_t("Settings")}</DropdownMenuItem>
        <DropdownMenuItem onClick={handleLogout}>
          {_t("Logout")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AuthenticatedUserMenu;

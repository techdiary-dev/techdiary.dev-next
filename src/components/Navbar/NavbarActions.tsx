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

const NavbarActions: React.FC = () => {
  const { toggle, lang, _t } = useTranslation();
  const authSession = useSession();

  return (
    <div className="flex items-center gap-2">
      <Button variant="ghost" className="md:hidden">
        <SearchIcon size={18} />
      </Button>

      <button
        onClick={toggle}
        className="hidden cursor-pointer items-center gap-1 rounded border border-border px-2 py-[2px] md:flex"
      >
        <svg
          className="hidden md:block"
          width={15}
          height={14}
          viewBox="0 0 15 14"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g clipPath="url(#clip0_9494_69309)">
            <path
              d="M8.4129 12.71C8.34261 12.8852 8.17283 13 7.98407 13C7.65462 13 7.43101 12.6651 7.5573 12.3608L10.0079 6.45676C10.1226 6.18024 10.3926 6 10.692 6C10.9914 6 11.2613 6.18024 11.3761 6.45676L13.8267 12.3608C13.953 12.6651 13.7294 13 13.3999 13C13.2112 13 13.0414 12.8852 12.9711 12.71L10.7344 7.13611C10.7275 7.11878 10.7107 7.10742 10.692 7.10742C10.6733 7.10742 10.6565 7.11878 10.6496 7.13611L8.4129 12.71ZM8.66745 10.6416C8.66745 10.434 8.83578 10.2656 9.04342 10.2656H12.3406C12.5482 10.2656 12.7165 10.434 12.7165 10.6416C12.7165 10.8492 12.5482 11.0176 12.3406 11.0176H9.04342C8.83578 11.0176 8.66745 10.8492 8.66745 10.6416Z"
              fill="#6B7280"
            />
            <path
              d="M8.75662 1C8.94575 1 9.09907 1.15332 9.09907 1.34244C9.09907 1.53157 8.94575 1.68489 8.75662 1.68489H8.0862V6.54228C8.0862 6.79507 7.88128 7 7.62848 7C7.45399 7 7.29663 6.8996 7.2092 6.74859C7.0493 6.47242 6.86254 6.22503 6.64891 6.00643C6.37238 5.71704 6.07656 5.46945 5.76145 5.26367L6.0026 4.62701C6.24698 4.76849 6.50099 4.96141 6.76466 5.20579C7.02833 5.45016 7.2309 5.69775 7.37238 5.94855C7.36595 5.85209 7.35952 5.76206 7.35309 5.67846C7.35309 5.59485 7.34987 5.50804 7.34344 5.41801C7.34344 5.32797 7.34344 5.23151 7.34344 5.12862V1.68489H0.634436C0.445309 1.68489 0.291992 1.53157 0.291992 1.34244C0.291992 1.15332 0.44531 1 0.634436 1H8.75662ZM4.01546 6.12219C3.57817 6.12219 3.16016 6.01929 2.76145 5.8135C2.36273 5.60772 1.98653 5.26045 1.63283 4.7717C1.33459 4.34644 1.05532 3.78598 0.795026 3.09035C0.722542 2.89664 0.82885 2.68352 1.02533 2.61892C1.21787 2.55562 1.42501 2.65882 1.49615 2.8486C1.68952 3.36445 1.88942 3.7997 2.09585 4.15434C2.35309 4.57878 2.63926 4.89068 2.95437 5.09003C3.26948 5.28939 3.62961 5.38907 4.03476 5.38907C4.38845 5.38907 4.67141 5.3344 4.88363 5.22508C5.10228 5.10932 5.25984 4.95498 5.3563 4.76206C5.45276 4.5627 5.501 4.34405 5.501 4.10611C5.501 3.73312 5.3981 3.43087 5.19231 3.19936C4.99296 2.96785 4.74215 2.85209 4.4399 2.85209C4.22768 2.85209 4.06691 2.90032 3.95759 2.99678C3.84826 3.08682 3.7936 3.22508 3.7936 3.41158C3.7936 3.45659 3.80003 3.51768 3.81289 3.59486C3.83172 3.70781 3.76689 3.82758 3.65455 3.84975L3.44714 3.89069C3.27022 3.9256 3.09239 3.82419 3.04741 3.64955C3.04177 3.62763 3.03648 3.60618 3.03154 3.58521C3.01225 3.46945 3.0026 3.36013 3.0026 3.25723C3.0026 3.01929 3.06691 2.81994 3.19553 2.65916C3.33058 2.49839 3.50099 2.37942 3.70678 2.30225C3.919 2.21865 4.14087 2.17685 4.37238 2.17685C4.7518 2.17685 5.07977 2.26367 5.3563 2.4373C5.63283 2.6045 5.84826 2.83601 6.0026 3.13183C6.15694 3.42765 6.23411 3.7717 6.23411 4.16399C6.23411 4.51125 6.15373 4.83601 5.99296 5.13826C5.83219 5.43408 5.58781 5.67203 5.25984 5.85209C4.93186 6.03215 4.51707 6.12219 4.01546 6.12219ZM3.70678 2.51447C3.67463 2.30868 3.57817 2.12862 3.41739 1.97428C3.26305 1.8135 3.03476 1.70096 2.73251 1.63666L2.96402 1.20257L3.3981 1.31833C3.76466 1.45981 4.02833 1.62058 4.1891 1.80064C4.34987 1.98071 4.44312 2.209 4.46884 2.48553L3.70678 2.51447Z"
              fill="#6B7280"
            />
          </g>
          <defs>
            <clipPath>
              <rect
                width={14}
                height={14}
                fill="white"
                transform="translate(0.291992)"
              />
            </clipPath>
          </defs>
        </svg>
        <span>{lang === "en" ? "বাং" : "En"}</span>
      </button>

      <ThemeSwitcher />
      <Button className="hidden md:block">{_t("New diary")}</Button>

      {authSession?.session ? <AuthenticatedMenu /> : <UnAuthenticatedMenu />}
    </div>
  );
};

export default NavbarActions;

const AuthenticatedMenu = () => {
  const { _t } = useTranslation();
  const authSession = useSession();

  // const handleLogout = async () => {
  //   modals.openConfirmModal({
  //     title: _t("Sure to logout?"),
  //     children: (
  //       <Text size="sm">{_t("You will be logged out after this")}</Text>
  //     ),
  //     labels: { confirm: _t("Logout"), cancel: _t("Cancel") },
  //     onCancel: () => console.log("না"),
  //     onConfirm: () => {
  //       authApi.logout().finally(() => {
  //         setCurrentUser(null);
  //         window.location.href = "/";
  //       });
  //     },
  //     confirmProps: { color: "red" },
  //   });
  // };

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
        <DropdownMenuItem>{_t("Logout")}</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const UnAuthenticatedMenu = () => {
  const { _t } = useTranslation();
  const handleLogin = async (provider: string) => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/api/oauth/${provider}`;
  };

  // return (
  //   <Menu shadow="md" width={200}>
  //     <Menu.Target>
  //       <UnstyledButton>
  //         <Avatar radius={"sm"} />
  //       </UnstyledButton>
  //     </Menu.Target>

  //     <Menu.Dropdown>
  //       <Menu.Item
  //         component="button"
  //         onClick={() => {
  //           handleLogin("github");
  //         }}
  //         leftSection={<AiFillGithub size={18} />}
  //       >
  //         {_t("Login with Github")}
  //       </Menu.Item>
  //       <Menu.Item
  //         component="button"
  //         onClick={() => handleLogin("google")}
  //         leftSection={<AiOutlineGoogle size={18} />}
  //       >
  //         {_t("Login with Google")}
  //       </Menu.Item>
  //     </Menu.Dropdown>
  //   </Menu>
  // );

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

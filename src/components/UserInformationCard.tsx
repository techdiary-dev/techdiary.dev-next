"use client";

import { useTranslation } from "@/i18n/use-translation";
import { Button } from "./ui/button";
import * as userActions from "@/backend/services/user.action";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "@/store/session.atom";
import Link from "next/link";
import Image from "next/image";

interface Props {
  userId: string;
}

const UserInformationCard: React.FC<Props> = ({ userId }) => {
  const { _t } = useTranslation();
  const session = useSession();
  const userQuery = useQuery({
    queryKey: ["user", userId],
    queryFn: () => userActions.getUserById(userId),
  });
  const profileData = {
    avatarUrl: userQuery.data?.profile_photo,
    name: userQuery.data?.name,
    title: userQuery.data?.designation,
    bio: userQuery.data?.bio,
    location: userQuery.data?.location,
    joinDate: userQuery.data?.created_at,
    education: userQuery.data?.education,
  };

  if (userQuery.isFetching)
    return (
      <>
        <div className="h-80 animate-pulse bg-muted rounded-sm"></div>
      </>
    );

  return (
    <div>
      {/* Profile Header */}
      <div className="py-3 flex items-center">
        {/* Avatar */}
        <div className="relative mr-4">
          <Image
            src={profileData.avatarUrl ?? ""}
            alt={profileData.name ?? ""}
            className="w-14 h-14 rounded-full object-cover border-2 border-white/90 shadow-md"
          />
        </div>

        {/* Name */}
        <div>
          <h2 className="text-xl font-bold">{profileData.name}</h2>
          <p className="text-sm text-muted-foreground">kingrayhan</p>
        </div>
      </div>

      {/* Profile Body */}
      <div className="space-y-4">
        {/* Edit Button */}
        {session?.user?.id == userId ? (
          <Button className="w-full" asChild>
            <Link href={"/dashboard/settings"}>{_t("Profile Settings")}</Link>
          </Button>
        ) : (
          <Button
            onClick={() => alert("Not implemented yet")}
            className="w-full"
          >
            {_t("Follow")}
          </Button>
        )}

        {/* Bio */}
        <p className="text-sm leading-relaxed text-muted-foreground">
          {profileData.bio}
        </p>

        {/* Profile Details */}
        <div className="space-y-3">
          {/* Location */}
          {profileData.location && (
            <div className="flex flex-col">
              <p className="font-semibold">{_t("Location")}</p>
              <p className="text-sm text-muted-foreground">
                {profileData.location}
              </p>
            </div>
          )}

          {profileData.education && (
            <div className="flex flex-col">
              <p className="font-semibold">{_t("Education")}</p>
              <p className="text-sm text-muted-foreground">
                {profileData.education}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserInformationCard;

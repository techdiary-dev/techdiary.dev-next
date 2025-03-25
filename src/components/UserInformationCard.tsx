"use client";

import { useTranslation } from "@/i18n/use-translation";
import { Button } from "./ui/button";

const UserInformationCard = () => {
  const { _t } = useTranslation();
  const profileData = {
    name: "King Rayhan",
    title: "Full Stack Developer",
    bio: "My name is Rayhan and I'm a full stack web developer, Nodejs wizard. With my 6+ years of freelancing career, I learned a lot of modern webs developing tools and frameworks like expressjs, reactjs..",
    location: "Dhaka, Bangladesh",
    education: "Computer Science and engineering",
    joinDate: "1 Mar 2018",
    avatarUrl: "https://avatars.githubusercontent.com/u/7611746?v=4",
  };

  return (
    <div>
      {/* Profile Header */}
      <div className="py-3 px-4 flex items-center">
        {/* Avatar */}
        <div className="relative mr-4">
          <img
            src={profileData.avatarUrl}
            alt={profileData.name}
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
      <div className="p-4 space-y-4">
        {/* Edit Button */}
        <Button className="w-full">Follow</Button>

        {/* Bio */}
        <p className="text-sm leading-relaxed text-muted-foreground">
          {profileData.bio}
        </p>

        {/* Profile Details */}
        <div className="space-y-3">
          {/* Location */}
          <div className="flex flex-col">
            <p className="font-semibold">{_t("Location")}</p>
            <p className="text-sm text-muted-foreground">
              {profileData.location}
            </p>
          </div>

          <div className="flex flex-col">
            <p className="font-semibold">{_t("Education")}</p>
            <p className="text-sm text-muted-foreground">
              {profileData.education}
            </p>
          </div>

          <div className="flex flex-col">
            <p className="font-semibold">{_t("Joined")}</p>
            <p className="text-sm text-muted-foreground">
              {profileData.joinDate}
            </p>
          </div>

          {/*  */}
        </div>
      </div>
    </div>
  );
};

export default UserInformationCard;

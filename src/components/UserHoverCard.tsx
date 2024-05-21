import { UserReference } from "@/http/models/User.model";
import { Image, Paper } from "@mantine/core";
import Link from "next/link";
import React from "react";
import { AiFillGithub, AiFillTwitterCircle } from "react-icons/ai";

interface Props {
  user: UserReference;
}

const UserHoverCard: React.FC<Props> = ({ user }) => {
  return (
    <Paper>
      <div className="flex items-start gap-2">
        <Image
          radius={"md"}
          src={user.profilePhoto}
          alt={user.username}
          className="h-10 w-10 flex-none"
        />

        <div className="flex flex-col">
          <Link
            href={`@${user?.username}`}
            className="text-base uppercase text-gray-800 dark:text-gray-100"
          >
            {user.name}
          </Link>
          <Link
            href={`@${user?.username}`}
            className="text-sm text-gray-600 dark:text-gray-300"
          >
            @{user.username}
          </Link>
          <div className="mt-2 flex gap-1">
            {user?.social_links?.github && (
              <a href={user?.social_links?.github} target="_blank">
                <AiFillGithub />
              </a>
            )}

            {user.social_links.twitter && (
              <a href={user?.social_links?.twitter} target="_blank">
                <AiFillTwitterCircle />
              </a>
            )}
          </div>
        </div>
      </div>
    </Paper>
  );
};

export default UserHoverCard;

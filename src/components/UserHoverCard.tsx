import { UserReference } from "@/http/models/User.model";
import Link from "next/link";
import React from "react";
import { AiFillGithub, AiFillTwitterCircle } from "react-icons/ai";
import classes from "./UserHoverCard.module.css";

interface Props {
  user: UserReference;
}

const UserHoverCard: React.FC<Props> = ({ user }) => {
  return (
    <div className={classes.card}>
      <div className="flex items-start gap-2">
        <img
          src={user.profilePhoto}
          alt={user.username}
          className="h-10 w-10 flex-none rounded-md"
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
              <a
                href={user?.social_links?.github}
                target="_blank"
                rel="noopener noreferrer"
              >
                <AiFillGithub className={classes.icon} />
              </a>
            )}

            {user.social_links.twitter && (
              <a
                href={user?.social_links?.twitter}
                target="_blank"
                rel="noopener noreferrer"
              >
                <AiFillTwitterCircle className={classes.icon} />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserHoverCard;

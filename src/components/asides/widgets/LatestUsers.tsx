import { http } from "@/http/http.client";
import { PaginatedResponse } from "@/http/models/PaginatedResponse.model";
import _t from "@/i18n/_t";
import { relativeTime } from "@/utils/relativeTime";
// import { relativeTime } from "@/utils/relativeTime";
import Link from "next/link";

interface IUser {
  id: string;
  name: string | null;
  username: string | null;
  profilePhoto: string | null;
  social_links: {
    twitter: string | null;
    github: string | null;
  };
  joined: Date;
}

const LatestUsers = async () => {
  const { data } = await http.get<PaginatedResponse<IUser>>(
    "/api/profile/list"
  );

  return (
    <div>
      <h3 className="mb-2 text-sm font-semibold text-gray-600 dark:text-slate-300">
        {_t("Latest registered users")}
      </h3>
      <div className="flex flex-col gap-5">
        {/* {isFetching &&
          Array.from({ length: 10 }).map((_, i) => <UserSkeleton key={i} />)} */}

        {/* <pre>{JSON.stringify(data, null, 2)}</pre> */}
        {data.data.map((user) => (
          <User key={user.id} user={user} />
        ))}
      </div>
    </div>
  );
};

export default LatestUsers;

const User = ({ user }: { user: IUser }) => (
  <div className="flex items-center" v-for="user in users">
    <Link href={`/@${user.username}`}>
      <div className="h-10 w-10 overflow-hidden rounded-full">
        <img
          src={user?.profilePhoto!}
          alt={user?.name!}
          loading="lazy"
          className="h-auto w-full"
        />
      </div>
    </Link>

    <div className="ml-2">
      <h3 className="text-dark text-base">
        <Link
          href={`/@${user?.username}`}
          className="text-gray-800 dark:text-gray-300"
        >
          {user.name}
        </Link>
      </h3>
      <p className="text-dark-secondary text-xs">
        {relativeTime(new Date(user.joined))}
      </p>
    </div>
  </div>
);

// const UserSkeleton = () => {
//   return (
//     <div className="flex items-center gap-2">
//       <Skeleton height={40} width={40} circle className="flex-none " />
//       <div className="flex w-full flex-col gap-2">
//         <Skeleton height={10} radius="xl" width={"70%"} />
//         <Skeleton height={6} radius="xl" width={"70%"} />
//       </div>
//     </div>
//   );
// };

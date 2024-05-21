import { http } from "@/http/http.client";
import {
  FaBehance,
  FaDribbble,
  FaFacebook,
  FaGithub,
  FaInstagram,
  FaLinkedinIn,
  FaMedium,
  FaStackOverflow,
  FaTwitch,
  FaTwitter,
  FaYoutube,
} from "react-icons/fa";
import BaseLayout from "@/components/layout/BaseLayout";
import { IUser } from "@/http/models/User.model";
import { Link2Icon } from "@radix-ui/react-icons";
import { NextPage } from "next";
import React from "react";

interface UserProfilePageProps {
  params: { username: string };
}

const UserProfilePage: NextPage<UserProfilePageProps> = async ({ params }) => {
  // get username from params
  // if there the username is started with @ then remove the @
  const username = params?.username?.startsWith("%40")
    ? params.username.replace("%40", "").toLowerCase()
    : params.username.toLowerCase();

  const {
    data: { data: profile },
    status,
  } = await http.get<{ data: IUser }>(`/api/profile/username/${username}`, {
    validateStatus: () => true,
  });

  if (status === 404) {
    throw new Error("ব্যবহারকারী খুঁজে পাওয়া যাচ্ছে না 🥹");
  } else if (status != 200) {
    throw new Error("কোন একটা সমস্যা হয়েছে 🚧");
  }

  return (
    <BaseLayout>
      <div className="wrapper">
        <div className="grid grid-cols-1 gap-6 my-2 lg:my-6 md:grid-cols-12 lg:gap-10">
          <aside className="md:col-span-3 col-span-full">
            <div>
              <img
                className="w-full rounded"
                src={
                  profile?.profilePhoto ||
                  `https://api.dicebear.com/8.x/initials/svg?seed=${profile?.username}`
                }
                alt={profile?.username}
              />
              <div className="mt-4">
                <h2 className="text-xl font-semibold">{profile?.name}</h2>
                <p className="lowercase">@{profile?.username}</p>
              </div>

              {profile?.designation && (
                <p className="my-2 text-base">{profile?.designation}</p>
              )}

              {profile?.bio && <p className="my-2 text-sm">{profile?.bio}</p>}

              {/* User infos start */}
              <div className="flex flex-col mt-4 space-y-4">
                {profile?.website_url && (
                  <div className="flex items-center space-x-1">
                    <Link2Icon className="w-5 h-5" />
                    <a
                      target="_blank"
                      href={profile?.website_url}
                      className="text-sm text-dark hover:underline"
                    >
                      {profile?.website_url}
                    </a>
                  </div>
                )}

                {profile?.education && (
                  <div className="flex items-center space-x-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-5 h-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                    </svg>
                    <span className="text-sm">{profile?.education}</span>
                  </div>
                )}
                {profile?.email && (
                  <div className="flex items-center space-x-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-5 h-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M14.243 5.757a6 6 0 10-.986 9.284 1 1 0 111.087 1.678A8 8 0 1118 10a3 3 0 01-4.8 2.401A4 4 0 1114 10a1 1 0 102 0c0-1.537-.586-3.07-1.757-4.243zM12 10a2 2 0 10-4 0 2 2 0 004 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-sm">{profile?.email}</span>
                  </div>
                )}

                {profile?.location && (
                  <div className="flex items-center space-x-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-5 h-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-sm">{profile?.location}</span>
                  </div>
                )}
              </div>
              {/* User infos end */}

              {/* Uer Socials start */}
              <div className="flex gap-2 mt-5">
                {profile?.social_links?.github && (
                  <a
                    href={profile?.social_links?.github}
                    target="_blank"
                    className=" text-forground-muted"
                  >
                    <FaGithub size={20} />
                  </a>
                )}

                {profile?.social_links?.facebook && (
                  <a
                    href={profile?.social_links?.facebook}
                    target="_blank"
                    className=" text-forground-muted"
                  >
                    <FaFacebook size={20} />
                  </a>
                )}

                {profile?.social_links?.stackOverflow && (
                  <a
                    href={profile?.social_links?.stackOverflow}
                    target="_blank"
                    className=" text-forground-muted"
                  >
                    <FaStackOverflow size={20} />
                  </a>
                )}

                {profile?.social_links?.medium && (
                  <a
                    href={profile?.social_links?.medium}
                    target="_blank"
                    className=" text-forground-muted"
                  >
                    <FaMedium size={20} />
                  </a>
                )}

                {profile?.social_links?.linkedin && (
                  <a
                    href={profile?.social_links?.linkedin}
                    target="_blank"
                    className=" text-forground-muted"
                  >
                    <FaLinkedinIn size={20} />
                  </a>
                )}
                {profile?.social_links?.twitter && (
                  <a
                    href={profile?.social_links?.twitter}
                    target="_blank"
                    className=" text-forground-muted"
                  >
                    <FaTwitter size={20} />
                  </a>
                )}

                {profile?.social_links?.instagram && (
                  <a
                    href={profile?.social_links?.instagram}
                    target="_blank"
                    className=" text-forground-muted"
                  >
                    <FaInstagram size={20} />
                  </a>
                )}

                {profile?.social_links?.behance && (
                  <a
                    href={profile?.social_links?.behance}
                    target="_blank"
                    className=" text-forground-muted"
                  >
                    <FaBehance size={20} />
                  </a>
                )}
                {profile?.social_links?.dribbble && (
                  <a
                    href={profile?.social_links?.dribbble}
                    target="_blank"
                    className=" text-forground-muted"
                  >
                    <FaDribbble size={20} />
                  </a>
                )}

                {profile?.social_links?.twitch && (
                  <a
                    href={profile?.social_links?.twitch}
                    target="_blank"
                    className=" text-forground-muted"
                  >
                    <FaTwitch size={20} />
                  </a>
                )}

                {profile?.social_links?.youtube && (
                  <a
                    href={profile?.social_links?.youtube}
                    target="_blank"
                    className=" text-forground-muted"
                  >
                    <FaYoutube size={20} />
                  </a>
                )}
              </div>
              {/* User Socials end */}
            </div>
          </aside>

          <main className="border rounded app-border-color md:col-span-9 col-span-full">
            <div
              dangerouslySetInnerHTML={{
                __html: profile?.profile_readme_html || "",
              }}
              className="p-4 content-typography"
            ></div>
          </main>
        </div>
      </div>
    </BaseLayout>
  );
};

export default UserProfilePage;

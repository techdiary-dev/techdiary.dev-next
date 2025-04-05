import { Article, User } from "@/backend/models/domain-models";
import { persistenceRepository } from "@/backend/persistence-repositories";
import {
  eq,
  joinTable,
} from "@/backend/persistence/persistence-where-operator";
import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

interface ArticlePageProps {
  params: Promise<{
    username: string;
    articleHandle: string;
  }>;
}

export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

const getFileLocation = async (path: string) => {
  const logoData = await readFile(join(process.cwd(), path));
  return Uint8Array.from(logoData).buffer;
};

export default async function Image(options: ArticlePageProps) {
  const { articleHandle } = await options.params;
  const [article] = await persistenceRepository.article.findRows({
    where: eq("handle", articleHandle),
    columns: ["title", "excerpt", "cover_image", "body"],
    limit: 1,
    joins: [
      joinTable<Article, User>({
        as: "user",
        joinTo: "users",
        localField: "author_id",
        foreignField: "id",
        columns: ["username", "profile_photo"],
      }),
    ],
  });

  return new ImageResponse(
    (
      <div
        style={{
          background: "white",
          fontFamily: "KohinoorBangla",
          fontWeight: 400,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          height: "100%",
          width: "100%",
        }}
      >
        <h2
          style={{
            fontSize: 32,
            padding: 30,
          }}
        >
          {article.title}
        </h2>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: 30,
          }}
        >
          {/* User profile */}
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <img
              style={{ height: 48, borderRadius: 100 }}
              src={article.user?.profile_photo ?? ""}
              alt="logo"
            />
            <p style={{ fontSize: 23 }}>
              @{article.user?.username ?? "Unknown user"}
            </p>
          </div>

          {/* Logo */}
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <img
              style={{ height: 48 }}
              src={(await getFileLocation("/public/logo-lg.png")) as any}
              alt="logo"
            />
            <p style={{ fontSize: 28 }}>Techdiary</p>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: "KohinoorBangla",
          data: await getFileLocation(
            "/public/fonts/KohinoorBangla-Regular.woff"
          ),
          style: "normal",
          weight: 400,
        },
      ],
    }
  );
}

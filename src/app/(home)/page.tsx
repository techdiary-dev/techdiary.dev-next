"use client";

import HomeLeftSidebar from "@/components/asides/HomeLeftSidebar";
import FakeEditor from "@/components/FakeEditor";
import ThreeColumnLayout from "@/components/layout/ThreeColumnLayout";
import { authClient } from "@/lib/auth-client";

// export const revalidate = 3600; // revalidate at most every hour

export default function Home() {
  const githubLogin = async () => {
    await authClient.signIn.social({
      provider: "github",
    });
  };

  return (
    <ThreeColumnLayout LeftSidebar={<HomeLeftSidebar />}>
      <FakeEditor />

      <button onClick={githubLogin}>Github</button>
      <div className="mt-8">{/* <ArticleFeed initialData={articles} /> */}</div>
      <div className="my-20"></div>
    </ThreeColumnLayout>
  );
}

import FakeEditor from "@/components/FakeEditor";
import ThreeColumnLayout from "@/components/layout/ThreeColumnLayout";

// export const revalidate = 3600; // revalidate at most every hour

export default async function Home() {
  return (
    <ThreeColumnLayout>
      <FakeEditor />
      <div className="mt-8">{/* <ArticleFeed initialData={articles} /> */}</div>
      <div className="my-20"></div>
    </ThreeColumnLayout>
  );
}

import FakeEditor from "@/components/FakeEditor";
import HomeLeftSidebar from "@/components/asides/HomeLeftSidebar";
import HomeRightSidebar from "@/components/asides/HomeRightSidebar";
import ThreeColumnLayout from "@/components/layout/ThreeColumnLayout";

export default async function Home() {
  // const _cookies = cookies().getAll();

  // const me = await http.get("api/profile/me", {
  //   headers: {
  //     Cookie: _cookies.map((c) => `${c.name}=${c.value}`).join("; "),
  //     referer: process.env.NEXT_PUBLIC_APP_URL,
  //   },
  // });

  return (
    <ThreeColumnLayout
      LeftSidebar={<HomeLeftSidebar />}
      RightSidebar={<HomeRightSidebar />}
    >
      <FakeEditor />
      <div className="mt-10 flex flex-col gap-10"></div>
      <div className="my-20"></div>
    </ThreeColumnLayout>
  );
}

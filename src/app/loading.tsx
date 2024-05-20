import BaseLayout from "@/components/layout/BaseLayout";
import { Loader } from "@mantine/core";
import React from "react";

const GlobalLoadingPage = () => {
  return (
    <BaseLayout>
      <div className=" grid place-items-center h-[calc(100vh-5rem)]">
        <Loader size={"lg"} />
      </div>
    </BaseLayout>
  );
};

export default GlobalLoadingPage;

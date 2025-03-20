import BaseLayout from "@/components/layout/BaseLayout";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Home",
};

const page = () => {
  return (
    <BaseLayout>
      <h1>আমার নাম রায়হান</h1>
    </BaseLayout>
  );
};

export default page;

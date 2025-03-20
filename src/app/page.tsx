import BaseLayout from "@/components/layout/BaseLayout";
import _t from "@/i18n/_t";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Home",
};

const page = () => {
  return (
    <BaseLayout>
      <h1>{_t("Home")}</h1>
    </BaseLayout>
  );
};

export default page;

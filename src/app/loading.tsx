import BaseLayout from "@/components/layout/BaseLayout";
import React from "react";
import classes from "./loading.module.css";

const GlobalLoadingPage = () => {
  return (
    <BaseLayout>
      <div className="grid place-items-center h-[calc(100vh-5rem)]">
        <div className={classes.spinner} />
      </div>
    </BaseLayout>
  );
};

export default GlobalLoadingPage;

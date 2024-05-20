"use client";
import ErrorPage from "@/components/ErrorPage";
import BaseLayout from "@/components/layout/BaseLayout";
import React from "react";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

const _ErrorPage: React.FC<ErrorPageProps> = (props) => {
  return (
    <BaseLayout>
      <ErrorPage {...props} />
    </BaseLayout>
  );
};

export default _ErrorPage;

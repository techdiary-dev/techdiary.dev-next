"use client";

import BaseLayout from "@/components/layout/BaseLayout";
import React from "react";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

const _ErrorPage: React.FC<ErrorPageProps> = (props) => {
  return (
    <BaseLayout>
      <h1>Error</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p>
        <i>{props.error.message}</i>
      </p>
      <button onClick={props.reset}>Try again</button>
    </BaseLayout>
  );
};

export default _ErrorPage;

"use client";

import { useTranslation } from "@/i18n/use-translation";
import Link from "next/link";
import React from "react";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

const _ErrorPage: React.FC<ErrorPageProps> = (props) => {
  return (
    <div className="max-w-xl mx-auto">
      <div className="flex flex-col items-center justify-center gap-4 p-4">
        <img src="/images/sadface.gif" className="max-w-full" alt="Error" />
        <p>
          <i>{props.error.message}</i>
        </p>
        <Link href="/">{"Go back to home"}</Link>
      </div>
    </div>
  );
};

export default _ErrorPage;

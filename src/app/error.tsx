"use client";

import Image from "next/image";
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
        <Image
          width={500}
          height={500}
          unoptimized
          src="/images/sadface.gif"
          className="max-w-full"
          alt="Error"
        />
        <p className="text-2xl text-destructive">
          <i>{props.error.message}</i>
        </p>
        <pre>{JSON.stringify(props.error, null, 2)}</pre>
        <Link href="/">{"Go back to home"}</Link>
      </div>
    </div>
  );
};

export default _ErrorPage;

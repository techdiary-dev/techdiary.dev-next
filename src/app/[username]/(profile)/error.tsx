"use client";

import BaseLayout from "@/components/layout/BaseLayout";
import React, { useEffect } from "react";

interface HomePageErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

const ProfileError: React.FC<HomePageErrorProps> = ({ error, reset }) => {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <BaseLayout>
      <pre>{JSON.stringify(error, null, 2)}</pre>
    </BaseLayout>
  );
};

export default ProfileError;

"use client";
import React, { useEffect } from "react";

interface HomePageErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

const HomePageError: React.FC<HomePageErrorProps> = ({ error, reset }) => {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div>
      <h2>Something went wrong!</h2>
      <pre>{JSON.stringify(error, null, 2)}</pre>
      <button
        onClick={
          // Attempt to recover by trying to re-render the segment
          () => reset()
        }
      >
        Try again
      </button>
    </div>
  );
};

export default HomePageError;

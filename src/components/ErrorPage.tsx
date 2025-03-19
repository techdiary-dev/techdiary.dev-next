import classes from "./ErrorPage.module.css";
import React from "react";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

const ErrorPage: React.FC<ErrorPageProps> = ({ error }) => {
  return (
    <div className={classes.root}>
      <h1 className={classes.title}>{error?.message} 🚧</h1>
      <div className={classes.buttonContainer}>
        <button
          className={classes.button}
          onClick={() => (window.location.href = "/")}
        >
          হোম পেইজে ফিরে যান
        </button>
      </div>
    </div>
  );
};

export default ErrorPage;

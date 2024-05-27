"use client";

import BaseLayout from "@/components/layout/BaseLayout";
import { setLanguage } from "@/i18n/i18n.server-action";
import React from "react";

const ExperimentPage = () => {
  const [count, setCount] = React.useState(0);
  return (
    <BaseLayout>
      <h1>Experiment {count}</h1>

      <form
        action={() => {
          setCount(count + 1);
          setLanguage("bn");
        }}
        method="post"
      >
        <input type="hidden" name="name" value="John" />
        <input type="hidden" name="email" value="john@example.com" />
        <button type="submit">Submit</button>
      </form>

      <button
        onClick={() => {
          setCount(count + 1);
          setLanguage("en");
        }}
      >
        Click me
      </button>
    </BaseLayout>
  );
};

export default ExperimentPage;

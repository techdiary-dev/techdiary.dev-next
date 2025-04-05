"use client";

import React from "react";

interface CalloutProps {
  type: "note" | "caution" | "check" | "warning";
  title: string;
}

export function Callout(props: any) {
  const [count, setCount] = React.useState(0);

  return (
    <div className="callout">
      <div className="content">
        <div className="copy">
          <span className="title">Callout {count}</span>
          <button onClick={() => setCount((count) => count + 1)}>
            Increment
          </button>

          <pre>
            <code>{JSON.stringify(props.children, null, 2)}</code>
          </pre>
        </div>
      </div>
    </div>
  );
}

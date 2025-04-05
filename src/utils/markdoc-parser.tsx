import Markdoc from "@markdoc/markdoc";
import React from "react";
import { Callout } from "./markdown-tags";

export const callout = {
  render: "Callout",
  children: ["paragraph", "tag", "list"],
  attributes: {
    type: {
      type: String,
      default: "note",
      matches: ["caution", "check", "note", "warning"],
    },
    title: {
      type: String,
    },
  },
};

export const markdocParser = (markdown: string) => {
  const ast = Markdoc.parse(markdown);
  const content = Markdoc.transform(ast, { tags: { callout } });

  Markdoc.renderers.react(content, React, { components: { callout: Callout } });
  return Markdoc.renderers.react(content, React, {
    components: {
      // The key here is the same string as `tag` in the previous step
      Callout: Callout,
    },
  });
};

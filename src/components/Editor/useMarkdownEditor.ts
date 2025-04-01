import { useRef, useState } from "react";

type MarkdownCommand =
  | "heading"
  | "bold"
  | "italic"
  | "link"
  | "bold"
  | "code"
  | "image";

interface Options {
  value?: string;
  ref?: React.RefObject<HTMLTextAreaElement | null>;
}

export function useMarkdownEditor(options?: Options) {
  const textareaRef = options?.ref;
  if (!textareaRef) return;

  const executeCommand = (command: MarkdownCommand) => {
    if (!textareaRef.current) return;
    const { selectionStart, selectionEnd } = textareaRef.current;
    let updatedValue = textareaRef.current.value;

    console.log({ updatedValue, selectionStart, selectionEnd });

    switch (command) {
      case "heading":
        updatedValue =
          updatedValue.substring(0, selectionStart) +
          `## ${updatedValue.substring(selectionStart, selectionEnd)}` +
          updatedValue.substring(selectionEnd);
        break;
      case "bold":
        updatedValue =
          updatedValue.substring(0, selectionStart) +
          `**${updatedValue.substring(selectionStart, selectionEnd)}**` +
          updatedValue.substring(selectionEnd);
        break;
      case "italic":
        updatedValue =
          updatedValue.substring(0, selectionStart) +
          `*${updatedValue.substring(selectionStart, selectionEnd)}*` +
          updatedValue.substring(selectionEnd);
        break;
      case "image":
        updatedValue =
          updatedValue.substring(0, selectionStart) +
          `![alt text](image-url)` +
          updatedValue.substring(selectionEnd);
        break;
    }
    textareaRef.current.value = updatedValue;
    // Trigger input event to notify changes
    const event = new Event("change", { bubbles: true });
    textareaRef.current.dispatchEvent(event);

    textareaRef.current.focus();
  };

  return { executeCommand };
}

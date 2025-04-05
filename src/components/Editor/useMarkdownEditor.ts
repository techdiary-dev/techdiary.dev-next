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
  onChange?: (value: string) => void;
}

export function useMarkdownEditor(options?: Options) {
  const textareaRef = options?.ref;
  if (!textareaRef) return;

  const executeCommand = (command: MarkdownCommand) => {
    if (!textareaRef.current) return;
    const { selectionStart, selectionEnd } = textareaRef.current;
    let updatedValue = textareaRef.current.value;

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

    if (options?.onChange) {
      options.onChange(updatedValue);
    }

    textareaRef.current.focus();
  };

  return { executeCommand };
}

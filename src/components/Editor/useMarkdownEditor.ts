import { useRef, useState } from "react";

type MarkdownCommand =
  | "heading"
  | "bold"
  | "italic"
  | "link"
  | "bold"
  | "code"
  | "image";

export function useMarkdownEditor() {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [value, setValue] = useState("");

  const executeCommand = (command: MarkdownCommand) => {
    if (!textareaRef.current) return;
    const { selectionStart, selectionEnd } = textareaRef.current;
    let updatedValue = value;

    switch (command) {
      case "heading":
        updatedValue =
          value.substring(0, selectionStart) +
          `## ${value.substring(selectionStart, selectionEnd)}` +
          value.substring(selectionEnd);
        break;
      case "bold":
        updatedValue =
          value.substring(0, selectionStart) +
          `**${value.substring(selectionStart, selectionEnd)}**` +
          value.substring(selectionEnd);
        break;
      case "italic":
        updatedValue =
          value.substring(0, selectionStart) +
          `*${value.substring(selectionStart, selectionEnd)}*` +
          value.substring(selectionEnd);
        break;
      case "image":
        updatedValue =
          value.substring(0, selectionStart) +
          `![alt text](image-url)` +
          value.substring(selectionEnd);
        break;
    }

    setValue(updatedValue);
    textareaRef.current.focus();
  };

  return { ref: textareaRef, value, setValue, executeCommand };
}

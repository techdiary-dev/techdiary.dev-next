import { useEffect } from "react";

/**
 * Automatically resizes a textarea to fit its content.
 * @param textAreaRef - Ref to the textarea element.
 * @param value - Current value of the textarea.
 * @param initialHeight - Optional initial height to set before autosizing.
 * @returns Nothing.
 *
 * return <textarea ref={textAreaRef} />;
 */
export function useAutosizeTextArea(
  textAreaRef: React.RefObject<HTMLTextAreaElement | null>,
  value: string,
  initialHeight?: string
): void {
  useEffect(() => {
    const textArea = textAreaRef.current;
    if (textArea) {
      // Apply initial height if provided
      if (initialHeight) {
        textArea.style.height = initialHeight;
      } else {
        textArea.style.height = "auto";
      }

      // Set height based on scrollHeight
      textArea.style.height = `${textArea.scrollHeight}px`;
    }
  }, [textAreaRef, value, initialHeight]);
}

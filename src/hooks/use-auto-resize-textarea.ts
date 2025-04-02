import { useEffect } from "react";

export function useAutoResizeTextarea(
  ref?: React.RefObject<HTMLTextAreaElement | null>
) {
  useEffect(() => {
    const textarea = ref?.current;
    if (!textarea) return;

    const computedStyle = window.getComputedStyle(textarea);
    const lineHeight = parseFloat(computedStyle.lineHeight);

    // Ensure a single line height initially
    textarea.style.height = `${lineHeight}px`;

    const resize = () => {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    };

    textarea.addEventListener("input", resize);
    resize();
    return () => textarea.removeEventListener("input", resize);
  }, [ref]);
}

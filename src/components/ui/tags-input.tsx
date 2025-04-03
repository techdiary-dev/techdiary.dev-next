import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import * as React from "react";

export interface TagInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  placeholder?: string;
  tags?: string[];
  onTagsChange?: (tags: string[]) => void;
  className?: string;
}

export function TagInput({
  placeholder = "Type and press enter...",
  tags = [],
  onTagsChange,
  className,
  ...props
}: TagInputProps) {
  const [inputValue, setInputValue] = React.useState("");
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue) {
      e.preventDefault();
      if (!tags.includes(inputValue.trim())) {
        const newTags = [...tags, inputValue.trim()];
        onTagsChange?.(newTags);
        setInputValue("");
      }
    } else if (e.key === "Backspace" && !inputValue && tags.length > 0) {
      e.preventDefault();
      const newTags = tags.slice(0, -1);
      onTagsChange?.(newTags);
    }
  };

  const removeTag = (tagToRemove: string) => {
    const newTags = tags.filter((tag) => tag !== tagToRemove);
    console.log({ newTags });
    onTagsChange?.(newTags);
  };

  const handleWrapperClick = () => {
    // inputRef.current?.focus();
  };

  return (
    <div
      className={cn(
        "flex min-h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
        className
      )}
      onClick={handleWrapperClick}
    >
      <div className="flex gap-1 flex-wrap">
        {tags.map((tag) => (
          <Badge
            key={tag}
            variant="secondary"
            className="flex items-center gap-1 select-none"
          >
            {tag}
            <button
              onClick={(e) => {
                e.stopPropagation();
                removeTag(tag);
              }}
            >
              <X className="h-3 w-3 cursor-pointer hover:text-destructive" />
            </button>
          </Badge>
        ))}
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={"Type and press enter..."}
          className="focus:outline-none"
          {...props}
        />
      </div>
    </div>
  );
}

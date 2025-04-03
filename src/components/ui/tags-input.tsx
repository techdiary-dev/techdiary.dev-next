import * as React from "react";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

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
    onTagsChange?.(newTags);
  };

  const handleWrapperClick = () => {
    inputRef.current?.focus();
  };

  return (
    <div
      className={cn(
        "flex min-h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
        className
      )}
      onClick={handleWrapperClick}
    >
      <div className="flex flex-wrap gap-1">
        {tags.map((tag) => (
          <Badge
            key={tag}
            variant="secondary"
            className="flex items-center gap-1 select-none"
          >
            {tag}
            <X
              className="h-3 w-3 cursor-pointer hover:text-destructive"
              onClick={(e) => {
                e.stopPropagation();
                removeTag(tag);
              }}
            />
          </Badge>
        ))}
        <Input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          className="flex-1 !m-0 !p-0 !border-none !outline-none !ring-0 !ring-offset-0 focus-visible:!ring-0 focus-visible:!ring-offset-0"
          placeholder={tags.length === 0 ? placeholder : ""}
          {...props}
        />
      </div>
    </div>
  );
}

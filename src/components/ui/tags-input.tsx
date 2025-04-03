"use client";

import * as React from "react";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

export type Tag = {
  id: string;
  text: string;
};

type TagInputProps = {
  placeholder?: string;
  tags: Tag[];
  setTags: React.Dispatch<React.SetStateAction<Tag[]>>;
  suggestions?: Tag[];
  disabled?: boolean;
  onTagAdd?: (tag: Tag) => void;
  onTagRemove?: (tagId: string) => void;
};

export function TagInput({
  placeholder = "Add tags...",
  tags,
  setTags,
  suggestions = [],
  disabled = false,
  onTagAdd,
  onTagRemove,
}: TagInputProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [inputValue, setInputValue] = React.useState("");
  const [open, setOpen] = React.useState(false);

  const handleAddTag = (text: string) => {
    const trimmedText = text.trim();
    if (!trimmedText) return;

    // Check if tag already exists
    if (
      tags.some((tag) => tag.text.toLowerCase() === trimmedText.toLowerCase())
    ) {
      return;
    }

    const newTag = { id: crypto.randomUUID(), text: trimmedText };
    setTags((prev) => [...prev, newTag]);
    onTagAdd?.(newTag);
    setInputValue("");
  };

  const handleRemoveTag = (tagId: string) => {
    setTags((prev) => prev.filter((tag) => tag.id !== tagId));
    onTagRemove?.(tagId);
    inputRef.current?.focus();
  };

  const filteredSuggestions = suggestions.filter(
    (suggestion) =>
      !tags.some(
        (tag) => tag.text.toLowerCase() === suggestion.text.toLowerCase()
      ) && suggestion.text.toLowerCase().includes(inputValue.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <Badge key={tag.id} variant="secondary" className="h-7 px-3">
            {tag.text}
            <button
              type="button"
              className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
              onClick={() => handleRemoveTag(tag.id)}
              disabled={disabled}
            >
              <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
              <span className="sr-only">Remove {tag.text}</span>
            </button>
          </Badge>
        ))}
      </div>
      <div className="relative">
        <Input
          ref={inputRef}
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            if (e.target.value.length > 0) {
              setOpen(true);
            } else {
              setOpen(false);
            }
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && inputValue) {
              e.preventDefault();
              handleAddTag(inputValue);
            } else if (
              e.key === "Backspace" &&
              !inputValue &&
              tags.length > 0
            ) {
              handleRemoveTag(tags[tags.length - 1].id);
            }
          }}
          onBlur={() => setOpen(false)}
          onFocus={() => inputValue && setOpen(true)}
          placeholder={placeholder}
          disabled={disabled}
          className="w-full"
        />
        {open && filteredSuggestions.length > 0 && (
          <div className="absolute top-full z-10 mt-1 w-full rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in">
            <div className="w-full p-1">
              {filteredSuggestions.map((suggestion) => (
                <div
                  key={suggestion.id}
                  onClick={() => {
                    handleAddTag(suggestion.text);
                    setOpen(false);
                  }}
                  className="flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground"
                >
                  {suggestion.text}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

import * as React from "react";

import { cn } from "@/lib/utils";

export interface InputProps extends React.ComponentProps<"input"> {
  Prefix?: React.ReactNode;
  Suffix?: React.ReactNode;
}

function Input({ className, Prefix, Suffix, type, ...props }: InputProps) {
  return (
    <div className="relative w-full">
      {Prefix && (
        <span
          data-slot="prefix"
          className="absolute inset-y-0 pl-2 left-0 flex items-center pointer-events-none"
        >
          {Prefix}
        </span>
      )}
      <input
        type={type}
        data-slot="input"
        className={cn(
          "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
          "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
          Prefix && "pl-6!",
          Suffix && "pr-6!",
          className
        )}
        {...props}
      />
      {Suffix && (
        <span
          data-slot="suffix"
          className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none"
        >
          {Suffix}
        </span>
      )}
    </div>
  );
}

export { Input };

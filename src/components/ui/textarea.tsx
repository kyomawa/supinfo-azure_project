import * as React from "react";

import { cn } from "@/lib/utils";

const Textarea = React.forwardRef<HTMLTextAreaElement, React.ComponentProps<"textarea">>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "border placeholder:text-neutral-500 dark:placeholder:text-white/55 border-neutral-200 bg-white dark:border-white/5 dark:bg-white/10 ring-offset-white flex min-h-[5rem] w-full rounded-md px-3 py-2 text-base  focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-950 focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";

export { Textarea };

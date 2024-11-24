import * as React from "react";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const textareaVariants = cva(
  "border placeholder:text-neutral-500 resize-none dark:placeholder:text-white/55 border-neutral-200 bg-white dark:border-white/5 dark:bg-white/10 ring-offset-white flex min-h-[5rem] w-full rounded-md px-3 py-2 text-base focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-950 focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
  {
    variants: {
      variant: {
        default:
          "border border-neutral-200 bg-white dark:border-white/5 dark:bg-white/10 ring-offset-white placeholder:text-neutral-500 dark:placeholder:text-white/55 focus-visible:ring-1 focus-visible:ring-slate-950 focus-visible:ring-offset-1",
        comment: "",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    VariantProps<typeof textareaVariants> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(({ className, variant, ...props }, ref) => {
  return <textarea className={cn(textareaVariants({ variant, className }))} ref={ref} {...props} />;
});

Textarea.displayName = "Textarea";

export { Textarea, textareaVariants };

import * as React from "react";

import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const inputVariants = cva(
  "flex h-10 w-full rounded-md px-3 py-2 text-base md:text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "border border-neutral-200 bg-white dark:border-white/5 dark:bg-white/10 ring-offset-white placeholder:text-neutral-500 dark:placeholder:text-white/55 focus-visible:ring-1 focus-visible:ring-slate-950 focus-visible:ring-offset-1 ",
        file: "border border-neutral-200 bg-white ring-offset-white dark:border-white/5 dark:bg-white/10 dark:placeholder:text-white/55 placeholder:text-neutral-500 focus-visible:ring-1 focus-visible:ring-slate-950 focus-visible:ring-offset-1   dark:text-neutral-10 dark:focus-visible:ring-slate-300 dark:ring-offset-primary-100/75",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement>, VariantProps<typeof inputVariants> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, variant, type, ...props }, ref) => {
  return <input type={type} className={cn(inputVariants({ variant, className }))} ref={ref} {...props} />;
});
Input.displayName = "Input";

export { Input, inputVariants };

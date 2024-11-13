import * as React from "react";

import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const inputVariants = cva(
  "flex h-10 w-full rounded-md px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "border border-neutral-200 bg-white ring-offset-white placeholder:text-neutral-500 focus-visible:ring-1 focus-visible:ring-slate-950 focus-visible:ring-offset-1 blue:border-primary-100/20 blue:bg-primary-950 blue:text-neutral-10 blue:placeholder:text-primary-100/65 blue:focus-visible:ring-slate-300 blue:ring-offset-primary-100/75",
        file: "border border-neutral-200 bg-white ring-offset-white placeholder:text-neutral-500 focus-visible:ring-1 focus-visible:ring-slate-950 focus-visible:ring-offset-1 blue:border-primary-100/20 blue:bg-primary-950 blue:text-neutral-10 blue:placeholder:text-primary-100/65 blue:focus-visible:ring-slate-300 blue:ring-offset-primary-100/75",
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

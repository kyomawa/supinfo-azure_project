"use client";

import { FormControl, FormItem, FormLabel, FormMessage, FormField, FormDescription } from "@/components/ui/form";
import { FieldValues, Path, UseFormReturn } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

// ===================================================================================================

type FormTextAreaFieldProps<TFieldValues extends FieldValues> = {
  title?: string;
  name: Path<TFieldValues>;
  form: UseFormReturn<TFieldValues>;
  isRequired?: boolean;
  placeholder?: string;
  description?: string;
  className?: string;
  disabled?: boolean;
};

export default function FormTextAreaField<TFieldValues extends FieldValues>({
  title,
  name,
  form,
  className,
  isRequired,
  placeholder,
  description,
  disabled,
}: FormTextAreaFieldProps<TFieldValues>) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          {title && (
            <FormLabel>
              {title} {isRequired && <span className="text-red-600 blue:text-red-400">*</span>}
            </FormLabel>
          )}
          <FormControl>
            <Textarea placeholder={placeholder} disabled={disabled} {...field} className={cn(className)} />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

// ===================================================================================================

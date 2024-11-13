"use client";

import { FormControl, FormItem, FormLabel, FormMessage, FormField, FormDescription } from "@/components/ui/form";
import { FieldValues, Path, UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";

// ===================================================================================================

type FormInputFieldProps<TFieldValues extends FieldValues> = {
  title?: string;
  name: Path<TFieldValues>;
  form: UseFormReturn<TFieldValues>;
  isRequired?: boolean;
  type?: "text" | "email" | "time" | "number";
  placeholder?: string;
  description?: string;
  disabled?: boolean;
};

export function FormInputField<TFieldValues extends FieldValues>({
  title,
  name,
  form,
  isRequired,
  type,
  description,
  placeholder,
  disabled,
}: FormInputFieldProps<TFieldValues>) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          {title && (
            <FormLabel>
              {title} {isRequired && <span className="text-red-600 dark:text-red-400">*</span>}
            </FormLabel>
          )}
          <FormControl>
            <Input type={type || "text"} placeholder={placeholder} disabled={disabled} {...field} />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

// ===================================================================================================

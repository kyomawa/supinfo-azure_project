"use client";

import { FormControl, FormItem, FormLabel, FormMessage, FormField, FormDescription } from "@/components/ui/form";
import { FieldValues, Path, UseFormReturn } from "react-hook-form";
import { Input, inputVariants } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { VariantProps } from "class-variance-authority";

// ===================================================================================================

type FormInputFieldProps<TFieldValues extends FieldValues> = {
  title?: string;
  inputClassName?: string;
  inputVariant?: VariantProps<typeof inputVariants>["variant"];
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
  inputClassName,
  form,
  inputVariant,
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
            <Input
              className={cn("", inputClassName)}
              type={type || "text"}
              variant={inputVariant || "default"}
              placeholder={placeholder}
              disabled={disabled}
              {...field}
            />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

// ===================================================================================================

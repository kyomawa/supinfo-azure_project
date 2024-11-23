"use client";

import { FormControl, FormItem, FormLabel, FormMessage, FormField, FormDescription } from "@/components/ui/form";
import { FieldValues, Path, UseFormReturn } from "react-hook-form";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { cn } from "@/lib/utils";

// ===================================================================================================

type FormSelectFieldProps<TFieldValues extends FieldValues> = {
  labelClassName?: string;
  className?: string;
  title?: string;
  name: Path<TFieldValues>;
  form: UseFormReturn<TFieldValues>;
  description?: string;
  isRequired?: boolean;
  options: { label: string; value: string }[];
  placeholder?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
};

export default function FormSelectField<TFieldValues extends FieldValues>({
  title,
  name,
  form,
  labelClassName,
  className,
  description,
  isRequired,
  options,
  onChange,
  placeholder,
  disabled,
}: FormSelectFieldProps<TFieldValues>) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          {title && (
            <FormLabel className={cn("", labelClassName)}>
              {title} {isRequired && <span className="text-red-600 dark:text-red-400">*</span>}
            </FormLabel>
          )}
          <FormControl>
            <Select
              onValueChange={(value) => {
                field.onChange(value);
                onChange?.(value);
              }}
              defaultValue={field.value}
              disabled={disabled}
            >
              <FormControl>
                <SelectTrigger
                  className={cn(
                    field.value ? "text-black dark:text-white" : "text-neutral-500 dark:text-white/40",
                    className
                  )}
                >
                  <SelectValue placeholder={placeholder || "Sélectionnez une option"} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {options.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

// ===================================================================================================

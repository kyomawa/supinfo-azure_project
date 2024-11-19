import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// =============================================================================================================================================

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// =============================================================================================================================================

export function createFormData<T extends Record<string, unknown>>(values: T): FormData {
  const formData = new FormData();
  Object.keys(values).forEach((key) => {
    const value = values[key];

    if (value !== undefined && value !== null) {
      if (value instanceof File) {
        formData.append(key, value);
      } else if (typeof value === "boolean") {
        formData.append(key, value ? "true" : "false");
      } else {
        formData.append(key, value.toString());
      }
    }
  });

  return formData;
}

// =============================================================================================================================================

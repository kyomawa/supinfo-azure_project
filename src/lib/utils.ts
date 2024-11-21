import { clsx, type ClassValue } from "clsx";
import imageCompression from "browser-image-compression";
import { twMerge } from "tailwind-merge";
import {
  differenceInHours,
  differenceInDays,
  differenceInWeeks,
  differenceInMonths,
  differenceInYears,
  differenceInMinutes,
} from "date-fns";

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

export const formatTimeAgo = (date: string | Date) => {
  const now = new Date();
  const createdDate = new Date(date);

  const minutes = differenceInMinutes(now, createdDate);
  if (minutes < 60) {
    return `il y a ${minutes}m`;
  }

  const hours = differenceInHours(now, createdDate);
  if (hours < 24) {
    return `il y a ${hours}h`;
  }

  const days = differenceInDays(now, createdDate);
  if (days < 7) {
    return `il y a ${days}j`;
  }

  const weeks = differenceInWeeks(now, createdDate);
  if (weeks < 4) {
    return `il y a ${weeks} sem`;
  }

  const months = differenceInMonths(now, createdDate);
  if (months < 12) {
    return `il y a ${months} mois`;
  }

  const years = differenceInYears(now, createdDate);
  return `il y a ${years} ans`;
};

// =============================================================================================================================================

const imageCompressionOptions = {
  maxSizeMB: 1,
  maxWidthOrHeight: 1200,
  useWebWorker: true,
};

export const onImageChangeCompress = async (
  event: React.ChangeEvent<HTMLInputElement>,
  onChange: (...event: unknown[]) => void,
  setCompressedFile: React.Dispatch<React.SetStateAction<File | null>>,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  enableSubmit?: () => void
) => {
  setIsLoading(true);
  const file = event?.target?.files?.[0];
  if (file) {
    try {
      const compressedBlob: Blob = await imageCompression(file, imageCompressionOptions);
      const compressedFile = new File([compressedBlob], file.name, {
        type: file.type,
        lastModified: Date.now(),
      });
      setCompressedFile(compressedFile);
      onChange(compressedFile);
      if (enableSubmit) {
        enableSubmit();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }
};

// =============================================================================================================================================

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Utility function to safely extract error message
export const getErrorMessage = (error: unknown): string => {
  if (error && typeof error === "object" && "message" in error) {
    return String(error.message);
  }
  return "An unexpected error occurred";
};

// Alternative approach using type guards
export const isError = (error: unknown): error is Error => {
  return error != null && typeof error === 'object' && 'message' in error && 'stack' in error;
};

// Safe error message extraction with fallback
export const safeErrorMessage = (error: unknown, fallback: string = "An unexpected error occurred"): string => {
  if (isError(error)) {
    return error.message;
  }
  if (error && typeof error === "object" && "message" in error) {
    return String(error.message);
  }
  return fallback;
};

import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function slugify(malformed: string) {
  return malformed
    .toLowerCase()
    .trim()
    .replace(/\ğ/g, "g")
    .replace(/\ü/g, "u")
    .replace(/\ş/g, "s")
    .replace(/\ı/g, "i")
    .replace(/\ö/g, "o")
    .replace(/\ç/g, "c")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
}

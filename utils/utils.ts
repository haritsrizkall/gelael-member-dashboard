import clsx, { ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
 
/** Merge classes with tailwind-merge with clsx full feature */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isExpired(date: string) {
  return new Date(date) < new Date();
}

export function statusString(start_at: string, expired_at: string) {
  if (isExpired(expired_at)) {
    return "Expired";
  }
  if (new Date(start_at) > new Date()) {
    return "Upcoming";
  }
  return "Active";
}

export function getApiUrl() {
  return process.env.DEV_API_URL != undefined ? process.env.DEV_API_URL : process.env.NEXT_PUBLIC_DEV_API_URL;
}
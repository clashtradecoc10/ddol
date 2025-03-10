import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import config from "@/app.config";
import { currentUser } from "@clerk/nextjs/server";
import { useUser } from "@clerk/nextjs";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function absoluteUrl(path: string) {
  if (typeof window !== "undefined") return path;
  if (process.env.VERCEL_URL) return `https://${config.domain}${path}`;
  return `http://localhost:3000${path}`;
}

export function timeAgo(date: Date): string {
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  const interval = Math.floor(seconds / 31536000); // Seconds in a year

  if (interval > 1) {
    return `${interval} years ago`;
  }
  if (interval === 1) {
    return `1 year ago`;
  }

  const monthInterval = Math.floor(seconds / 2592000); // Seconds in a month
  if (monthInterval > 1) {
    return `${monthInterval} months ago`;
  }
  if (monthInterval === 1) {
    return `1 month ago`;
  }

  const dayInterval = Math.floor(seconds / 86400); // Seconds in a day
  if (dayInterval > 1) {
    return `${dayInterval} days ago`;
  }
  if (dayInterval === 1) {
    return `1 day ago`;
  }

  const hourInterval = Math.floor(seconds / 3600); // Seconds in an hour
  if (hourInterval > 1) {
    return `${hourInterval} hours ago`;
  }
  if (hourInterval === 1) {
    return `1 hour ago`;
  }

  const minuteInterval = Math.floor(seconds / 60); // Seconds in a minute
  if (minuteInterval > 1) {
    return `${minuteInterval} minutes ago`;
  }
  if (minuteInterval === 1) {
    return `1 minute ago`;
  }

  return `Just now`;
}

export function formatDate(date: Date): string {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return new Intl.DateTimeFormat("en-US", options).format(date);
}

export const base64Encode = (str: string) => {
  if (typeof window !== "undefined") {
    return btoa(str);
  }
  return Buffer.from(str).toString("base64");
};

export function useHasValidSubscription(): boolean {
  const { user } = useUser();

  if (!user) return false;

  const metadata = user.publicMetadata as {
    subscriptionPlan?: string;
    subscriptionEnd?: number;
  };

  return !!(
    metadata.subscriptionPlan &&
    metadata.subscriptionEnd! > new Date().getTime()
  );
}

"use server";

import { Ratelimit } from "@upstash/ratelimit";
import { redis } from "@/lib/upstash";
import { headers } from "next/headers";

const rateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(1, "12h"),
});

export const isRateLimited = async () => {
  const headersList = await headers();
  const ip = headersList.get("x-forwarded-for");
  const { remaining } = await rateLimit.getRemaining(ip!);
  return remaining <= 0;
};

export const limitRate = async () => {
  const headersList = await headers();
  const ip = headersList.get("x-forwarded-for");
  const { success } = await rateLimit.limit(ip!);
  return !success;
};

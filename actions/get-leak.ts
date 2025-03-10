"use server";

import { db } from "@/lib/db";
import { Leaks } from "@prisma/client";

interface LeakResult {
  leak: Leaks | null;
  validToken: boolean;
  link: string;
}

export async function getLeak(
  id: string,
  token?: string,
  isPremium?: boolean
): Promise<LeakResult | null> {
  try {
    const leak = await db.cleanLeaks.findUnique({
      where: {
        id: id,
      },
    });

    if (!leak) {
      return null;
    }

    if (isPremium) {
      return { leak, validToken: true, link: leak.link };
    }

    if (token && leak.redirect === token) {
      return { leak, validToken: true, link: leak.link };
    }

    return { leak, validToken: false, link: leak.link };
  } catch (error) {
    console.error(error);
    return null;
  }
}

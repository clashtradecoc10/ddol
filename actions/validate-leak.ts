"use server";

import { db } from "@/lib/db";
import { Leaks } from "@prisma/client";

export async function validateLeak(id: string, token: string) {
  try {
    if (!token || !id) {
      return null;
    }

    const leak = await db.cleanLeaks.findUnique({
      where: {
        id: id,
      },
    });

    if (!leak) {
      return null;
    }

    if (leak?.redirect === token) {
      return leak as Leaks;
    } else {
      return null;
    }
  } catch (error) {
    console.error(error);
    return null;
  }
}

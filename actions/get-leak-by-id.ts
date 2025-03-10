"use server";

import { db } from "@/lib/db";

export async function getLeakById(id: string) {
  try {
    const leak = await db.cleanLeaks.findUnique({
      where: {
        id: id,
      },
      select: {
        name: true,
        image: true,
        date: true,
      },
    });

    if (!leak) {
      return null;
    }

    return leak;
  } catch (error) {
    console.error(error);
    return null;
  }
}

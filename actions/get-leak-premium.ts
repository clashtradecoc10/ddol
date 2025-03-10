"use server";

import { db } from "@/lib/db";

export async function getLeakPremium(id: string) {
  try {
    const leak = await db.cleanLeaks.findUnique({
      where: {
        id: id,
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

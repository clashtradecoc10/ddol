"use server";

import { db } from "@/lib/db";
import { CleanLeaks } from "@prisma/client";

export async function getLeaksAfterId(
  lastId: string,
  page: number,
  limit: number
) {
  const offset = (page - 1) * limit;

  try {
    let leaks;
    const lastLeak = await db.cleanLeaks.findUnique({
      where: { id: lastId },
      select: { date: true },
    });

    if (!lastLeak) {
      throw new Error("Invalid lastId provided");
    }

    leaks = await db.cleanLeaks.findMany({
      take: limit,
      skip: offset,
      where: {
        date: {
          lt: lastLeak.date,
        },
      },
      orderBy: {
        date: "desc",
      },
      select: {
        id: true,
        name: true,
        image: true,
        date: true,
        redirect: true,
      },
    });

    return leaks as CleanLeaks[];
  } catch (error) {
    console.error(error);
    return [];
  }
}

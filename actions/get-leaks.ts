"use server";

import { db } from "@/lib/db";
import { CleanLeaks } from "@prisma/client";

export async function getLeak(page: number, limit: number) {
  const offset = (page - 1) * limit;

  try {
    const leaks = await db.cleanLeaks.findMany({
      take: limit,
      skip: offset,
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

    console.log("wjqf");

    return leaks as CleanLeaks[];
  } catch (error) {
    console.error(error);
    return [];
  }
}

"use server";

import { db } from "@/lib/db";

export async function getLeaksByMonth(
  page: number,
  limit: number,
  year: number,
  month: number
) {
  const offset = (page - 1) * limit;

  const startDate = new Date(Date.UTC(year, month - 1, 1));
  const endDate = new Date(Date.UTC(year, month, 0, 23, 59, 59, 999));

  try {
    const leaks = await db.cleanLeaks.findMany({
      take: limit,
      skip: offset,
      where: {
        date: {
          gte: startDate,
          lte: endDate,
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
      },
    });

    const formattedLeaks = leaks.map((leak: any) => ({
      ...leak,
      date: leak.date.toISOString(),
    }));

    return formattedLeaks;
  } catch (error) {
    console.error(error);
    return [];
  }
}

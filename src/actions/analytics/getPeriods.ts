"use server";

import { db } from "@/db";
import { workflowExecutionTable } from "@/db/schema";
import { getUser } from "@/lib/sessions";
import { eq, sql } from "drizzle-orm";

export type Period = {
  month: number;
  year: number;
};

export const getPeriods = async () => {
  const user = await getUser();
  if (!user) {
    throw new Error("Unauthorized");
  }
  const rawResult = await db
    .select({
      minStartedAt: sql`MIN(${workflowExecutionTable.startedAt})`,
    })
    .from(workflowExecutionTable)
    .where(eq(workflowExecutionTable.userId, user.id));

  // Manually structure the result to match the Prisma output shape
  const result = {
    _min: {
      startedAt:
        rawResult[0]?.minStartedAt &&
        typeof rawResult[0].minStartedAt === "string"
          ? new Date(rawResult[0].minStartedAt)
          : new Date(),
    },
  };

  const currentYear = new Date().getFullYear();
  const minYear = result._min.startedAt.getFullYear();

  const periods: Period[] = [];
  for (let year = minYear; year <= currentYear; year++) {
    for (let month = 0; month <= 11; month++) {
      periods.push({ year, month });
    }
  }
  return periods;
};

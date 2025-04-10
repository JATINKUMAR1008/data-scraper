"use server";

"use server";

import { getUser } from "@/lib/sessions";
import { Period } from "./getPeriods";
import { PeriodToDateRange } from "@/lib/helpers/dates";
import { db } from "@/db";
import { and, between, eq, inArray } from "drizzle-orm";
import { ExecutionPhase, workflowExecutionTable } from "@/db/schema";
import { eachDayOfInterval, format } from "date-fns";
import { ExecutionPhaseStatus, ExecutionStatus } from "@/types/workflow";

export type Stats = Record<
  string,
  {
    success: number;
    failed: number;
  }
>;

export async function GetCreditUsageInPeriod(period: Period) {
  const user = await getUser();
  if (!user) {
    throw new Error("Unauthorized");
  }
  const dateRange = PeriodToDateRange(period);
  const executionsPhases = await db.query.ExecutionPhase.findMany({
    where: and(
      eq(workflowExecutionTable.userId, user.id),
      between(
        workflowExecutionTable.startedAt,
        dateRange.startDate,
        dateRange.endDate
      ),
      inArray(ExecutionPhase.status, [
        ExecutionPhaseStatus.COMPLETED,
        ExecutionPhaseStatus.FAILED,
      ])
    ),
  });
  const stats: Stats = eachDayOfInterval({
    start: dateRange.startDate,
    end: dateRange.endDate,
  })
    .map((date) => format(date, "yyyy-MM-dd"))
    .reduce((acc, date) => {
      acc[date] = {
        success: 0,
        failed: 0,
      };
      return acc;
    }, {} as any);

  executionsPhases.forEach((execution) => {
    const date = format(execution.startedAt!, "yyyy-MM-dd");
    if (execution.status === ExecutionPhaseStatus.COMPLETED) {
      stats[date].success += execution.creditsConsumed || 0;
    }
    if (execution.status === ExecutionPhaseStatus.FAILED) {
      stats[date].failed += execution.creditsConsumed || 0;
    }
  });
  const result = Object.entries(stats).map(([date, info]) => ({
    date,
    ...info,
  }));
  return result;
}

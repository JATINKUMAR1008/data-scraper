"use server";

import { getUser } from "@/lib/sessions";
import { Period } from "./getPeriods";
import { PeriodToDateRange } from "@/lib/helpers/dates";
import { db } from "@/db";
import { and, between, eq } from "drizzle-orm";
import { workflowExecutionTable } from "@/db/schema";
import { eachDayOfInterval, format } from "date-fns";
import { ExecutionStatus } from "@/types/workflow";

export type Stats = Record<
  string,
  {
    success: number;
    failed: number;
  }
>;

export async function GetWorkflowExecutionStats(period: Period) {
  const user = await getUser();
  if (!user) {
    throw new Error("Unauthorized");
  }
  const dateRange = PeriodToDateRange(period);
  const executions = await db.query.workflowExecutionTable.findMany({
    where: and(
      eq(workflowExecutionTable.userId, user.id),
      between(
        workflowExecutionTable.startedAt,
        dateRange.startDate,
        dateRange.endDate
      )
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

  executions.forEach((execution) => {
    const date = format(execution.startedAt!, "yyyy-MM-dd");
    if (execution.status === ExecutionStatus.COMPLETED) {
      stats[date].success += 1;
    }
    if (execution.status === ExecutionStatus.FAILED) {
      stats[date].failed += 1;
    }
  });
  const result = Object.entries(stats).map(([date, info]) => ({
    date,
    ...info,
  }));
  return result;
}

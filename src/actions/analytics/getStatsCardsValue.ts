"use server";

import { PeriodToDateRange } from "@/lib/helpers/dates";
import { Period } from "./getPeriods";
import { getUser } from "@/lib/sessions";
import { db } from "@/db";
import { and, between, eq, inArray, ne } from "drizzle-orm";
import { ExecutionPhase, workflowExecutionTable } from "@/db/schema";
import { ExecutionStatus } from "@/types/workflow";

export async function GetStatsCardsValue(period: Period) {
  const dateRange = PeriodToDateRange(period);
  const { COMPLETED, FAILED } = ExecutionStatus;
  const user = await getUser();
  if (!user) {
    throw new Error("Unauthorized");
  }
  const executions = await db.query.workflowExecutionTable.findMany({
    where: and(
      eq(workflowExecutionTable.userId, user.id),
      between(
        workflowExecutionTable.startedAt,
        dateRange.startDate,
        dateRange.endDate
      ),
      inArray(workflowExecutionTable.status, [COMPLETED, FAILED])
    ),
    columns: {
      creditsConsumed: true,
    },
    with: {
      phases: {
        where: ne(ExecutionPhase.creditsConsumed, 0),
        columns: {
          creditsConsumed: true,
        },
      },
    },
  });
  console.log(executions);
  const stats = {
    workflowExecutions: executions.length,
    creditsConsumed: 0,
    phaseExecutions: 0,
  };
  stats.creditsConsumed = executions.reduce(
    (sum, execution) => sum + (execution.creditsConsumed ?? 0),
    0
  );
  stats.phaseExecutions = executions.reduce(
    (sum, execution) => sum + execution.phases.length,
    0
  );
  return stats;
}

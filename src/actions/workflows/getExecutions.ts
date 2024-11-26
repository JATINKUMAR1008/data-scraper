"use server";
import { db } from "@/db";
import { workflowExecutionTable } from "@/db/schema";
import { getUser } from "@/lib/sessions";
import { desc, eq } from "drizzle-orm";

export const getExecutionsForWorkflow = async (workflowId: string) => {
  const user = await getUser();
  if (!user) {
    throw new Error("User not found");
  }
  const executions = await db.query.workflowExecutionTable.findMany({
    where: eq(workflowExecutionTable.workflowId, Number(workflowId)),
    orderBy: desc(workflowExecutionTable.createdAt),
  });
  return executions;
};

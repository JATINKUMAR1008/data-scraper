"use server";

import { db } from "@/db";
import { workflowTable } from "@/db/schema";
import { WorkflowStatus } from "@/types/workflow";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export const updateWorkflow = async ({
  workflowId,
  definition,
}: {
  workflowId: number;
  definition: string;
}) => {
  const workflow = await db.query.workflowTable.findFirst({
    where: eq(workflowTable.id, workflowId),
  });
  if (!workflow) {
    throw new Error("Workflow not found");
  }
  if (workflow.status !== WorkflowStatus.DRAFT) {
    throw new Error("Workflow is not in draft state");
  }
  await db
    .update(workflowTable)
    .set({
      definition,
    })
    .where(eq(workflowTable.id, workflowId));
  revalidatePath("/workflows");
};

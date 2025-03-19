"use server";

import { db } from "@/db";
import { workflowTable } from "@/db/schema";
import { getUser } from "@/lib/sessions";
import { WorkflowStatus } from "@/types/workflow";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function UnpublishWorkflow(id: string) {
  const user = await getUser();
  if (!user) {
    throw new Error("User not found");
  }
  const workflow = await db.query.workflowTable.findFirst({
    where: eq(workflowTable.id, Number(id)),
  });
  if (!workflow) {
    throw new Error("workflow not found");
  }
  if (workflow.status !== WorkflowStatus.PUBLISHED) {
    throw new Error("workflow is not published");
  }
  await db
    .update(workflowTable)
    .set({
      status: WorkflowStatus.DRAFT,
      executionPlan: null,
      creditsCost: 0,
    })
    .where(eq(workflowTable.id, Number(id)));

  revalidatePath(`/workflow/editor/${id}`);
}

"use server";

import { db } from "@/db";
import { workflowTable } from "@/db/schema";
import { getUser } from "@/lib/sessions";
import { FlowExecutionPlan } from "@/lib/workflow/FlowExecutionPlan";
import { CalculateWorkflowCost } from "@/lib/workflow/helpers";
import { WorkflowStatus } from "@/types/workflow";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function publishWorkflow({
  id,
  flowDefinition,
}: {
  id: string;
  flowDefinition: string;
}) {
  const user = await getUser();
  if (!user) {
    throw new Error("User not found");
  }
  const workflow = await db.query.workflowTable.findFirst({
    where: eq(workflowTable.id, Number(id)),
  });
  if (!workflow) {
    throw new Error("Workflow not found");
  }
  if (workflow.status !== WorkflowStatus.DRAFT) {
    throw new Error("Workflow is not in draft state");
  }
  const flow = JSON.parse(flowDefinition);
  const result = FlowExecutionPlan(flow.nodes, flow.edges);
  if (result.error) {
    throw new Error("Invalid Flow Definition");
  }
  if (!result.executionPlan) {
    throw new Error("Execution Plan not found");
  }
  const creditsCost = CalculateWorkflowCost(flow.nodes);
  await db
    .update(workflowTable)
    .set({
      status: WorkflowStatus.PUBLISHED,
      executionPlan: JSON.stringify(result.executionPlan),
      creditsCost,
      definition: flowDefinition,
    })
    .where(eq(workflowTable.id, Number(id)));
  revalidatePath(`/workflow/editor/${id}`);
}

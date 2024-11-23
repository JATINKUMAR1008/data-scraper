"use server";
import { db } from "@/db";
import { workflowTable } from "@/db/schema";
import { getUser } from "@/lib/sessions";
import { createFlowNode } from "@/lib/workflow/createFlowNode";
import {
  createWorkFlowSchemaType,
  createWorkflowSchema,
} from "@/schemas/workflows";
import { AppNode } from "@/types/appNodes";
import { TaskType } from "@/types/task";
import { WorkflowStatus } from "@/types/workflow";
import { Edge } from "@xyflow/react";
import { redirect } from "next/navigation";

export const createWorkflow = async (
  form: createWorkFlowSchemaType
): Promise<{ success: boolean; error?: string; workflowId?: string }> => {
  const validatefields = createWorkflowSchema.safeParse(form);
  if (!validatefields.success) {
    throw new Error("Invalid data");
  }

  const user = await getUser();
  if (!user) {
    throw new Error("User not found");
  }
  const initialFlow: {
    nodes: AppNode[];
    edges: Edge[];
  } = {
    nodes: [],
    edges: [],
  };
  initialFlow.nodes.push(createFlowNode(TaskType.LAUNCH_BROWSER));
  const result = await db
    .insert(workflowTable)
    .values({
      name: validatefields.data.name,
      userId: user.id,
      status: WorkflowStatus.DRAFT,
      definition: JSON.stringify(initialFlow),
      description: validatefields.data.description,
    })
    .returning({
      insertedId: workflowTable.id,
    });
  console.log(result);
  if (result.length === 0) {
    console.log("Workflow creation failed");
    throw new Error("Workflow creation failed");
  }
  const redirectUrl = new URL(
    `/workflow/editor/${result[0].insertedId}`,
    process.env.NEXT_PUBLIC_APP_URL
  ).toString();

  redirect(redirectUrl);
};

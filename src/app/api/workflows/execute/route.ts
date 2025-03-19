import { db } from "@/db";
import {
  ExecutionPhase,
  workflowExecutionTable,
  workflowTable,
} from "@/db/schema";
import { ExecutionWorkflow } from "@/lib/workflow/executionWorkflow";
import { TaskRegistry } from "@/lib/workflow/task/Registry";
import {
  ExecutionPhaseStatus,
  ExecutionStatus,
  WorkFlowExecutionPlan,
  WorkflowExecutionTrigger,
} from "@/types/workflow";
import { eq } from "drizzle-orm";
import parser from "cron-parser";
export async function GET(req: Request) {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer")) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  const token = authHeader.split(" ")[1];
  if (token !== process.env.API_SECRET) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { searchParams } = new URL(req.url);
  const workflowId = searchParams.get("workflowId");
  if (!workflowId) {
    return Response.json({ error: "Workflow ID is required" }, { status: 400 });
  }
  const workflow = await db.query.workflowTable.findFirst({
    where: eq(workflowTable.id, Number(workflowId)),
  });
  if (!workflow) {
    return Response.json({ error: "Workflow not found" }, { status: 404 });
  }
  const executionPlan = JSON.parse(
    workflow.executionPlan!
  ) as WorkFlowExecutionPlan;

  if (!executionPlan) {
    return Response.json({ error: "Workflow not found" }, { status: 404 });
  }
  let nextRun;
  try {
    const cron = parser.parse(workflow.cron!, {
      tz: "UTC",
    });
    nextRun = cron.next().toDate();
  } catch (error) {
    return Response.json({ error: "Internal sever error" }, { status: 500 });
  }
  const execution = await db
    .insert(workflowExecutionTable)
    .values({
      workflowId: Number(workflowId),
      userId: workflow.userId,
      trigger: WorkflowExecutionTrigger.SCHEDULED,
      status: ExecutionStatus.PENDING,
      startedAt: new Date(),
      definition: workflow.definition || "{}",
    })
    .returning({
      id: workflowExecutionTable.id,
    });

  if (!execution) {
    throw new Error("Execution not created");
  }

  // Create all phases sequentially
  for (const phase of executionPlan) {
    const phasePromises = phase.nodes.map((node) =>
      db
        .insert(ExecutionPhase)
        .values({
          userId: workflow.userId,
          executionId: execution[0].id,
          number: phase.phase,
          node: JSON.stringify(node),
          name: TaskRegistry[node.data.type].label,
          status: ExecutionPhaseStatus.CREATED,
        })
        .returning({
          id: ExecutionPhase.id,
        })
    );

    await Promise.all(phasePromises);
  }
  await ExecutionWorkflow(execution[0].id.toString(),nextRun);
  return new Response(null, { status: 200 });
}

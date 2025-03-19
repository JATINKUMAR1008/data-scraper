import { db } from "@/db";
import { workflowTable } from "@/db/schema";
import { getAppUrl } from "@/lib/helpers/appUrl";
import { WorkflowStatus } from "@/types/workflow";
import { error } from "console";
import { and, eq, isNotNull, lte } from "drizzle-orm";

export async function GET(req: Request) {
  try {
    const now = new Date();

    const workflows = await db.query.workflowTable.findMany({
      columns: {
        id: true,
      },
      where: and(
        eq(workflowTable.status, WorkflowStatus.PUBLISHED),
        isNotNull(workflowTable.cron),
        lte(workflowTable.nextRunAt, now)
      ),
    });

    console.log("@WORKFLOW TO RUN", workflows.length);

    for (const workflow of workflows) {
      triggerWorkflow(workflow.id);
    }
    return Response.json({ workflows });
  } catch (error) {
    console.error("Error fetching cron workflows:", error);
    return Response.json(
      { error: "Failed to fetch workflows" },
      { status: 500 }
    );
  }
}

function triggerWorkflow(id: number) {
  const triggerUrl = getAppUrl(`api/workflows/execute?workflowId=${id}`);
  fetch(triggerUrl, {
    headers: {
      Authorization: `Bearer ${process.env.API_SECRET!}`,
    },
    cache: "no-store",
    signal: AbortSignal.timeout(5000),
  }).catch((error) =>
    console.error("Error triggering workflow of id ", id, ":error->", error)
  );
}

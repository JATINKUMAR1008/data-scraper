"use server";

import { db } from "@/db";
import { workflowTable } from "@/db/schema";
import { getUser } from "@/lib/sessions";
import parser from "cron-parser";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function UpdateWorkflowCron({
  id,
  cron,
}: {
  id: string;
  cron: string;
}) {
  const user = await getUser();
  if (!user) throw new Error("Unauthorized");
  try {
    const interval = parser.parse(cron, {
      tz: "UTC",
    });
    await db
      .update(workflowTable)
      .set({
        cron,
        nextRunAt: interval.next().toDate(),
      })
      .where(eq(workflowTable.id, Number(id)));
    revalidatePath(`/workflows`);
  } catch (error) {
    console.error("Invalid cron expression", error);
    throw new Error("Invalid cron expression");
  }
}

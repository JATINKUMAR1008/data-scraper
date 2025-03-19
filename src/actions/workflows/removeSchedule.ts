"use server";

import { db } from "@/db";
import { workflowTable } from "@/db/schema";
import { getUser } from "@/lib/sessions";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function RemoveSchedule(id: string) {
  const user = getUser();
  if (!user) throw new Error("Unauthorized");
  await db
    .update(workflowTable)
    .set({
      cron: null,
      nextRunAt: null,
    })
    .where(eq(workflowTable.id, Number(id)));
  revalidatePath("/workflows");
}

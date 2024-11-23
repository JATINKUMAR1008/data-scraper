"use server";

import { db } from "@/db";
import { workflowTable } from "@/db/schema";
import { getUser } from "@/lib/sessions";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

export async function getWorkflowsForUser() {
  const user = await getUser();
  if (!user) {
    redirect("/signin");
  }
  const workflows = await db.query.workflowTable.findMany({
    where: eq(workflowTable.userId, user.id),
  });
  return workflows;
}

export async function getWorkflowById(id: string | number) {
  const workflow = await db.query.workflowTable.findFirst({
    where: eq(workflowTable.id, Number(id)),
  });
  return workflow;
}

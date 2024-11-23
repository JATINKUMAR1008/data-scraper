"use server";
import { db } from "@/db";
import { workflowTable } from "@/db/schema";
import { getUser } from "@/lib/sessions";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export const deleteWorkFlow = async (id: string | number) => {
  const user = await getUser();
  if (!user) {
    throw new Error("User not found");
  }
  await db.delete(workflowTable).where(eq(workflowTable.id, Number(id)));
  revalidatePath("/workflows");
};

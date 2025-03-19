"use server";

import { db } from "@/db";
import { credentialsTable } from "@/db/schema";
import { getUser } from "@/lib/sessions";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function deleteCredential(credentialId: number) {
  const user = await getUser();
  if (!user) {
    throw new Error("User not found");
  }
  await db
    .delete(credentialsTable)
    .where(eq(credentialsTable.id, credentialId));
  revalidatePath("/credentials");
}

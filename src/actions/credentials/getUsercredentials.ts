"use server";

import { db } from "@/db";
import { credentialsTable } from "@/db/schema";
import { getUser } from "@/lib/sessions";
import { eq } from "drizzle-orm";

export async function getUserCredentials() {
  const user = await getUser();
  if (!user) {
    return [];
  }

  const credentials = await db.query.credentialsTable.findMany({
    where: eq(credentialsTable.userId, user.id),
    orderBy: (credentialsTable, { asc }) => [asc(credentialsTable.name)],
  });

  return credentials;
}

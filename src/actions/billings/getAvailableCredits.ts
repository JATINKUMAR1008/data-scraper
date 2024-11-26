"use server";

import { db } from "@/db";
import { UserBalance } from "@/db/schema";
import { getUser } from "@/lib/sessions";
import { eq } from "drizzle-orm";

export async function getAvailableCredits() {
  const user = await getUser();
  if (!user) {
    throw new Error("User not found");
  }
  const balance = await db.query.UserBalance.findFirst({
    where: eq(UserBalance.userId, user.id),
  });
  if (!balance) return -1;
  return balance.credits;
}

import { db } from "@/db";
import { UserBalance } from "@/db/schema";
import { getCreditsPack, PackId } from "@/types/billing";
import { eq, sql } from "drizzle-orm";
import { User } from "lucide-react";
import Stripe from "stripe";

export async function HandleCheckoutSessionCompleted(
  event: Stripe.Checkout.Session
) {
  if (!event.metadata) {
    throw new Error("missing metadata");
  }
  const { userId, packId } = event.metadata;
  if (!userId) {
    throw new Error("User ID is missing");
  }
  if (!packId) {
    throw new Error("Pack ID is missing");
  }

  const purchasePack = getCreditsPack(packId as PackId);
  if (!purchasePack) {
    throw new Error("purchase pack not found");
  }

  await db
    .update(UserBalance)
    .set({
      credits: sql`${UserBalance.credits} + ${purchasePack.credits}`,
    })
    .where(eq(UserBalance.userId, Number(userId)));
}

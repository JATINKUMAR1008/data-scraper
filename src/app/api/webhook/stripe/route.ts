import { HandleCheckoutSessionCompleted } from "@/lib/stripe/handleCheckoutComplete";
import { stripe } from "@/lib/stripe/stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const rawBody = await request.text();
  const signature = (await headers()).get("stripe-signature")!;
  let event;
  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error) {
    console.error("stripe webhook error", error);
    return new NextResponse("webhook error", { status: 400 });
  }
  switch (event.type) {
    case "checkout.session.completed":
      HandleCheckoutSessionCompleted(event.data.object);
      break;
    default:
      break;
  }
  return new NextResponse(null, { status: 200 });
}

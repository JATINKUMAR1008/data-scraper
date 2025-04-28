import { HandleCheckoutSessionCompleted } from "@/lib/stripe/handleCheckoutComplete";
import { stripe } from "@/lib/stripe/stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const rawBody = await request.text();

  // 2. Get Stripe signature header
  const signature = (await headers()).get("stripe-signature")!;

  try {
    const event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
    switch (event.type) {
      case "checkout.session.completed":
        HandleCheckoutSessionCompleted(event.data.object);
        break;
      default:
        break;
    }
    return new NextResponse(null, { status: 200 });
  } catch (error) {
    console.error("stripe webhook error", error);
    return new NextResponse("webhook error", { status: 400 });
  }
}

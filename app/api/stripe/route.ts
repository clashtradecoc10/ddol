import { db } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";
import type Stripe from "stripe";
import { clerkClient } from "@clerk/nextjs/server";

export async function POST(request: Request) {
  const body = await request.text();
  const headersList = await headers();
  const signature = headersList.get("Stripe-Signature") ?? "";

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
    console.log(`Webhook event received: ${event.type}`, {
      eventId: event.id,
      apiVersion: event.api_version,
    });
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return new Response(
      `Webhook Error: ${err instanceof Error ? err.message : "Unknown Error"}`,
      { status: 400 }
    );
  }

  const session = event.data.object as Stripe.Checkout.Session;

  if (event.type === "checkout.session.completed") {
    if (!session?.metadata?.clerkId) {
      console.warn(
        "Checkout session completed but no clerkId found in metadata"
      );
      return new Response(null, {
        status: 200,
      });
    }

    try {
      const subscription = await stripe.subscriptions.retrieve(
        session.subscription as string
      );

      // Determine subscription plan from price ID
      const subscriptionPlan =
        subscription.items.data[0]?.price.id ===
        process.env.NEXT_PUBLIC_YEARLY_SUBSCRIPTION_PRICE_ID
          ? "yearly"
          : "monthly";

      await db.user.update({
        where: {
          clerk_id: session.metadata.clerkId,
        },
        data: {
          subscriptionPlan,
          stripeSubscriptionId: subscription.id,
          stripeCustomerId: subscription.customer as string,
          stripePriceId: subscription.items.data[0]?.price.id,
          stripeCurrentPeriodEnd: new Date(
            subscription.current_period_end * 1000
          ),
        },
      });

      const clerk = await clerkClient();
      await clerk.users.updateUser(session.metadata.clerkId, {
        publicMetadata: {
          subscriptionEnd: subscription.current_period_end * 1000,
          subscriptionPlan,
        },
      });

      console.log("Successfully processed checkout.session.completed", {
        clerkId: session.metadata.clerkId,
        subscriptionId: subscription.id,
      });
    } catch (error) {
      console.error("Failed to process checkout.session.completed:", error);
      return new Response("Internal Server Error", { status: 500 });
    }
  }

  if (event.type === "invoice.payment_succeeded") {
    try {
      const subscription = await stripe.subscriptions.retrieve(
        session.subscription as string
      );

      const user = await db.user.findUnique({
        where: {
          stripeSubscriptionId: subscription.id,
        },
        select: {
          clerk_id: true,
        },
      });

      if (!user) {
        throw new Error("User not found");
      }

      // Determine subscription plan from price ID
      const subscriptionPlan =
        subscription.items.data[0]?.price.id ===
        process.env.NEXT_PUBLIC_YEARLY_SUBSCRIPTION_PRICE_ID
          ? "yearly"
          : "monthly";

      await db.user.update({
        where: {
          stripeSubscriptionId: subscription.id,
        },
        data: {
          stripePriceId: subscription.items.data[0]?.price.id,
          stripeCurrentPeriodEnd: new Date(
            subscription.current_period_end * 1000
          ),
          subscriptionPlan,
        },
      });

      const clerk = await clerkClient();
      await clerk.users.updateUser(user.clerk_id, {
        publicMetadata: {
          subscriptionEnd: subscription.current_period_end * 1000,
          subscriptionPlan,
        },
      });

      console.log("Successfully processed invoice.payment_succeeded", {
        subscriptionId: subscription.id,
        nextPeriodEnd: new Date(subscription.current_period_end * 1000),
      });
    } catch (error) {
      console.error("Failed to process invoice.payment_succeeded:", error);
      return new Response("Internal Server Error", { status: 500 });
    }
  }

  if (event.type === "customer.subscription.deleted") {
    try {
      const subscription = event.data.object as Stripe.Subscription;

      const user = await db.user.findUnique({
        where: {
          stripeSubscriptionId: subscription.id,
        },
        select: {
          clerk_id: true,
        },
      });

      if (!user) {
        throw new Error("User not found");
      }

      // Clear subscription data from database
      await db.user.update({
        where: {
          stripeSubscriptionId: subscription.id,
        },
        data: {
          subscriptionPlan: null,
          stripePriceId: null,
          stripeCurrentPeriodEnd: null,
          // Don't clear stripeCustomerId as it might be needed for future subscriptions
        },
      });

      // Clear subscription metadata from Clerk
      const clerk = await clerkClient();
      await clerk.users.updateUser(user.clerk_id, {
        publicMetadata: {
          subscriptionEnd: null,
          subscriptionPlan: null,
        },
      });

      console.log("Successfully processed subscription cancellation", {
        subscriptionId: subscription.id,
      });
    } catch (error) {
      console.error("Failed to process subscription cancellation:", error);
      return new Response("Internal Server Error", { status: 500 });
    }
  }

  return new Response(null, { status: 200 });
}

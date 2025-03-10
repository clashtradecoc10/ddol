"use server";

import { db } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { absoluteUrl } from "@/lib/utils";
import { auth, clerkClient } from "@clerk/nextjs/server";

export async function createCheckoutSession(isYearlySubscription: boolean) {
  try {
    const { userId } = await auth();

    if (!userId) {
      throw new Error("User not authenticated");
    }

    const dbUser = await db.user.findUnique({
      where: {
        clerk_id: userId,
      },
      select: {
        stripeCustomerId: true,
        stripeSubscriptionId: true,
      },
    });

    if (dbUser?.stripeSubscriptionId) {
      const subscription = await stripe.subscriptions.retrieve(
        dbUser.stripeSubscriptionId
      );
      if (subscription.status === "active") {
        throw new Error("You already have an active subscription");
      }
    }

    const clerk = await clerkClient();
    const user = await clerk.users.getUser(userId);
    const userEmail = user.emailAddresses[0]?.emailAddress;

    if (!userEmail) {
      throw new Error("No email address found for user");
    }

    const successUrl = absoluteUrl("/premium");
    const cancelUrl = absoluteUrl("/premium");

    const session = await stripe.checkout.sessions.create({
      success_url: successUrl,
      cancel_url: cancelUrl,
      payment_method_types: ["card"],
      mode: "subscription" as const,
      billing_address_collection: "auto",
      customer_email: userEmail,
      line_items: [
        {
          price: isYearlySubscription
            ? process.env.NEXT_PUBLIC_YEARLY_SUBSCRIPTION_PRICE_ID
            : process.env.NEXT_PUBLIC_MONTHLY_SUBSCRIPTION_PRICE_ID,
          quantity: 1,
        },
      ],
      metadata: {
        clerkId: userId,
      },
    });

    return session.url;
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return null;
  }
}

export async function createCustomerPortalSession() {
  try {
    const { userId } = await auth();
    if (!userId)
      throw new Error("You must be logged in to manage your subscription");

    const user = await db.user.findUnique({
      where: { clerk_id: userId },
      select: { stripeCustomerId: true },
    });

    if (!user?.stripeCustomerId) {
      throw new Error("No active subscription found");
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: user.stripeCustomerId,
      return_url: absoluteUrl("/premium"),
    });

    return session.url;
  } catch (error) {
    console.error("Error creating portal session:", error);
    throw error; // Let the UI handle the error
  }
}

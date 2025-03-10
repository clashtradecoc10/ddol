import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export async function getUserSubscriptionPlan() {
  const { userId } = await auth();

  if (!userId) {
    return;
  }

  const dbUser = await db.user.findFirst({
    where: {
      clerk_id: userId,
    },
  });

  if (!dbUser) {
    return;
  }

  const isSubscribed = Boolean(
    dbUser.stripePriceId &&
      dbUser.stripeCurrentPeriodEnd && // 86400000 = 1 day
      dbUser.stripeCurrentPeriodEnd.getTime() + 86_400_000 > Date.now()
  );

  let isCanceled = false;
  if (isSubscribed && dbUser.stripeSubscriptionId) {
    const stripePlan = await stripe.subscriptions.retrieve(
      dbUser.stripeSubscriptionId
    );
    isCanceled = stripePlan.cancel_at_period_end;
  }

  return {
    subscriptionPlan: dbUser.subscriptionPlan,
    stripeSubscriptionId: dbUser.stripeSubscriptionId,
    stripeCurrentPeriodEnd: dbUser.stripeCurrentPeriodEnd,
    stripeCustomerId: dbUser.stripeCustomerId,
    isSubscribed,
    isCanceled,
  };
}

export async function hasValidSubscription() {
  const { userId } = await auth();

  if (!userId) {
    return;
  }

  const dbUser = await db.user.findFirst({
    where: {
      clerk_id: userId,
    },
  });

  if (!dbUser) {
    return;
  }

  return Boolean(
    dbUser.stripePriceId &&
      dbUser.stripeCurrentPeriodEnd && // 86400000 = 1 day
      dbUser.stripeCurrentPeriodEnd.getTime() + 86_400_000 > Date.now()
  );
}

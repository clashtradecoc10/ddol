"use client";

import { Check } from "lucide-react";
import { Button } from "./ui/button";
import { createCustomerPortalSession } from "@/actions/stripe";
import { useRouter } from "next/navigation";

export function SubscribedUserContent({
  subscriptionPlan,
}: {
  subscriptionPlan: string;
}) {
  const router = useRouter();
  const isYearly = subscriptionPlan === "yearly";

  const handleManageSubscription = async () => {
    const portalUrl = await createCustomerPortalSession();
    if (portalUrl) {
      router.push(portalUrl);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-background rounded-lg shadow-md overflow-visible relative border-2 border-pink-400 shadow-pink-300">
        <div className="absolute -top-5 left-0 right-0 mx-auto w-32 rounded-full bg-gradient-to-r from-pink-200 to-pink-400 px-3 py-2 text-sm font-medium text-black text-center">
          Current Plan
        </div>
        <div className="px-6 py-8 sm:px-10 sm:py-10">
          <h3 className="text-2xl font-bold text-primary">
            {isYearly ? "Yearly" : "Monthly"} Subscription
          </h3>
          <p className="mt-4 text-muted-foreground">
            {isYearly
              ? "Save 20% with our annual plan."
              : "Flexible monthly subscription."}
          </p>
          <div className="mt-6">
            <span className="text-5xl font-bold text-primary">
              $
              {isYearly
                ? process.env.NEXT_PUBLIC_YEARLY_PRICE
                : process.env.NEXT_PUBLIC_MONTHLY_PRICE}
            </span>
            <span className="text-muted-foreground">
              /{isYearly ? "year" : "month"}
            </span>
          </div>
          <ul className="mt-8 space-y-3 text-muted-foreground">
            <li className="flex items-start">
              <Check className="mr-2 h-5 w-5 text-primary" />
              <span>No Ads</span>
            </li>
            <li className="flex items-start">
              <Check className="mr-2 h-5 w-5 text-primary" />
              <span>Access to All Leaks</span>
            </li>
            <li className="flex items-start">
              <Check className="mr-2 h-5 w-5 text-primary" />
              <span>Premium Content</span>
            </li>
          </ul>
          <div className="mt-10">
            <Button
              onClick={handleManageSubscription}
              className="w-full !text-black !bg-pink-400 rounded-lg text-center !shadow-pink-300"
            >
              Manage Subscription
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

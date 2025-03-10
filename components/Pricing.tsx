"use client";

import Link from "next/link";
import { Check, X } from "lucide-react";
import { Button, buttonVariants } from "./ui/button";
import { useRouter } from "next/navigation";
import { createCheckoutSession } from "@/actions/stripe";

const Pricing = ({ isLoggedIn }: { isLoggedIn: boolean }) => {
  const router = useRouter();

  const handleContinueClick = async (yearlySubscription: boolean) => {
    if (!isLoggedIn) {
      router.push("/premium/register");
    } else {
      const checkoutUrl = await createCheckoutSession(yearlySubscription);
      if (checkoutUrl) {
        router.push(checkoutUrl);
      }
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
        <div className="bg-background rounded-lg shadow-md overflow-hidden mb-8 md:mb-0">
          <div className="px-6 py-8 sm:px-10 sm:py-10">
            <h3 className="text-2xl font-bold text-primary">Free</h3>
            <p className="mt-4 text-muted-foreground">
              Get started with our free plan.
            </p>
            <div className="mt-6">
              <span className="text-5xl font-bold text-primary">$0</span>
              <span className="text-muted-foreground">/month</span>
            </div>
            <ul className="mt-8 space-y-3 text-muted-foreground">
              <li className="flex items-start">
                <X className="mr-2 h-5 w-5 text-primary" />
                <span>No Ads</span>
              </li>
              <li className="flex items-start">
                <X className="mr-2 h-5 w-5 text-primary" />
                <span>Access to All Leaks</span>
              </li>
              <li className="flex items-start">
                <X className="mr-2 h-5 w-5 text-primary" />
                <span>Premium Content</span>
              </li>
            </ul>
            <div className="mt-10">
              <Link
                href="/"
                className={buttonVariants({
                  className:
                    "w-full !text-black !bg-pink-400 rounded-lg text-center",
                })}
              >
                Continue
              </Link>
            </div>
          </div>
        </div>
        <div className="bg-background rounded-lg shadow-md overflow-visible relative md:scale-110 border-2 border-pink-400 shadow-pink-300">
          <div className="absolute -top-5 left-0 right-0 mx-auto w-32 rounded-full bg-gradient-to-r from-pink-200 to-pink-400 px-3 py-2 text-sm font-medium text-black text-center">
            Upgrade now
          </div>
          <div className="px-6 py-8 sm:px-10 sm:py-10">
            <h3 className="text-2xl font-bold text-primary">
              Yearly Subscription
            </h3>
            <p className="mt-4 text-muted-foreground">
              Save 20% with our annual plan.
            </p>
            <div className="mt-6">
              <span className="text-5xl font-bold text-primary">
                ${process.env.NEXT_PUBLIC_YEARLY_PRICE}
              </span>
              <span className="text-muted-foreground">/year</span>
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
                onClick={() => handleContinueClick(true)}
                className="w-full !text-black !bg-pink-400 rounded-lg text-center !shadow-pink-300"
              >
                Continue
              </Button>
            </div>
          </div>
        </div>
        <div className="bg-background rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-8 sm:px-10 sm:py-10">
            <h3 className="text-2xl font-bold text-primary">
              Monthly Subscription
            </h3>
            <p className="mt-4 text-muted-foreground">
              Flexible monthly subscription.
            </p>
            <div className="mt-6">
              <span className="text-5xl font-bold text-primary">
                ${process.env.NEXT_PUBLIC_MONTHLY_PRICE}
              </span>
              <span className="text-muted-foreground">/month</span>
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
                <X className="mr-2 h-5 w-5 text-primary" />
                <span>Premium Content</span>
              </li>
            </ul>
            <div className="mt-10">
              <Button
                onClick={() => handleContinueClick(false)}
                className="w-full !text-black !bg-pink-400 rounded-lg text-center !shadow-pink-300"
              >
                Continue
              </Button>
            </div>
          </div>
        </div>
      </div>
      {/* Register & Pay 
        <div className="flex justify-center items-center w-full">
          <div className="bg-background rounded-lg shadow-md overflow-visible relative border-2 border-pink-400 shadow-pink-300">
            <div className="absolute -top-5 left-0 right-0 mx-auto w-32 rounded-full bg-gradient-to-r from-pink-200 to-pink-400 px-3 py-2 text-sm font-medium text-black text-center">
              Register & Pay
            </div>
            <div className="px-6 py-8 sm:px-10 sm:py-10">
              <h3 className="text-2xl font-bold text-primary text-center">
                {selectedPlan === "monthly" ? "Monthly" : "Yearly"} Subscription
              </h3>
              <p className="my-4 text-muted-foreground">
                Your account will be created after payment.
              </p>
              <RegisterForm plan={selectedPlan} />
              <Button onClick={() => handleBackClick()} className="w-full mt-2">
                Back
              </Button>
            </div>
          </div>
        </div>*/}
    </>
  );
};

export default Pricing;

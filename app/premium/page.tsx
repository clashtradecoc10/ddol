import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import Pricing from "@/components/Pricing";
import { SubscribedUserContent } from "@/components/SubscribedUserContent";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { Check, AlertCircle } from "lucide-react";

const Page = async () => {
  const { userId } = await auth();
  const clerk = await clerkClient();

  let statusMessage = null;
  let metadata: { subscriptionPlan?: string; subscriptionEnd?: number } | null =
    null;

  if (userId) {
    const user = await clerk.users.getUser(userId);
    metadata = user.publicMetadata as {
      subscriptionPlan?: string;
      subscriptionEnd?: number;
    };

    if (metadata.subscriptionPlan) {
      const hasValidSubscription =
        metadata.subscriptionEnd! > new Date().getTime();

      statusMessage = hasValidSubscription ? (
        <div className="p-4 bg-green-100 text-green-800 rounded-lg flex items-center gap-2 border-green-600 border">
          <Check className="h-5 w-5" />
          <span>
            You have an active {metadata.subscriptionPlan} subscription until{" "}
            {new Date(metadata.subscriptionEnd!).toLocaleDateString()}
          </span>
        </div>
      ) : (
        <div className="p-4 bg-yellow-100 text-yellow-800 rounded-lg flex items-center gap-2 border-yellow-600 border">
          <AlertCircle className="h-5 w-5" />
          <span>
            Your {metadata.subscriptionPlan} subscription expired on{" "}
            {new Date(metadata.subscriptionEnd!).toLocaleDateString()}
          </span>
        </div>
      );
    }
  }

  const hasActiveSubscription =
    metadata?.subscriptionPlan &&
    metadata.subscriptionEnd! > new Date().getTime();

  return (
    <div className="flex-grow flex-1 bg-muted">
      <MaxWidthWrapper className="flex flex-col items-center py-6 md:py-24 space-y-14">
        {statusMessage}
        {hasActiveSubscription ? (
          <SubscribedUserContent
            subscriptionPlan={metadata?.subscriptionPlan!}
          />
        ) : (
          <Pricing isLoggedIn={!!userId} />
        )}
      </MaxWidthWrapper>
    </div>
  );
};

export default Page;

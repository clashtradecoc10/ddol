import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import BuyPremium from "@/components/BuyPremium";
import ModelDrawer from "@/components/ModelDrawer";
import Notice from "@/components/Notice";
import models from "@/public/main.json";
import { LoadMore } from "@/components/load-more";
import { auth, currentUser } from "@clerk/nextjs/server";
import { useHasValidSubscription } from "@/lib/utils";
import { hasValidSubscription } from "@/actions/has-premium-subscription";

export default async function Home() {
  const user = await currentUser();
  const isPremium = user ? await hasValidSubscription() : false;

  return (
    <div className="flex-grow flex-1 bg-muted py-6">
      <MaxWidthWrapper className="space-y-6">
        <BuyPremium isLoggedIn={!!user} isPremium={isPremium} />
        <div>
          <Notice text="/ Hosted on mega.nz" />
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            <ModelDrawer
              models={models}
              isPremium={isPremium}
              year={null}
              month={null}
            />
            <LoadMore isPremium={isPremium} />
          </div>
        </div>
      </MaxWidthWrapper>
    </div>
  );
}

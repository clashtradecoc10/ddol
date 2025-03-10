import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import BuyPremium from "@/components/BuyPremium";
import Notice from "@/components/Notice";
import ArchiveGallery from "@/components/ArchiveGallery";
import { currentUser } from "@clerk/nextjs/server";
import { hasValidSubscription } from "@/actions/has-premium-subscription";

const Page = async () => {
  const user = await currentUser();
  const isPremium = user ? await hasValidSubscription() : false;

  return (
    <div className="flex-grow flex-1 bg-muted py-6">
      <MaxWidthWrapper className="space-y-6">
        <BuyPremium isPremium={isPremium} isLoggedIn={!!user} />
        <div>
          <Notice text="/ Hosted on mega.nz" />
          <ArchiveGallery />
        </div>
      </MaxWidthWrapper>
    </div>
  );
};

export default Page;

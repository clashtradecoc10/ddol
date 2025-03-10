import { getLeaksByMonth } from "@/actions/get-leaks-by-month";
import { hasValidSubscription } from "@/actions/has-premium-subscription";
import BuyPremium from "@/components/BuyPremium";
import { LoadMore } from "@/components/load-more";
import { LoadMoreMonth } from "@/components/load-more-month";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import ModelDrawer from "@/components/ModelDrawer";
import Notice from "@/components/Notice";
import { currentUser } from "@clerk/nextjs/server";

type Params = Promise<{
  date: string;
}>;

type SearchParams = Promise<{
  [key: string]: string | string[] | undefined;
}>;

const Page = async ({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: SearchParams;
}) => {
  const { date } = await params;

  const user = await currentUser();
  const isPremium = user ? await hasValidSubscription() : false;

  const [year, month] = date.split("-").map(Number);

  if (isNaN(year) || isNaN(month)) {
    return null;
  }

  const models = await getLeaksByMonth(1, 48, year, month);

  return (
    <div className="flex-grow flex-1 bg-muted py-6">
      <MaxWidthWrapper className="space-y-6">
        <BuyPremium isPremium={isPremium} isLoggedIn={!!user} />
        <div>
          <Notice text="/ Hosted on mega.nz" />
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            <ModelDrawer
              models={models}
              isPremium={isPremium}
              year={year}
              month={month}
            />
            <LoadMoreMonth isPremium={isPremium} year={year} month={month} />
          </div>
        </div>
      </MaxWidthWrapper>
    </div>
  );
};

export default Page;

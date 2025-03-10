import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import UnlockModel from "@/components/UnlockModel";
import { Metadata, ResolvingMetadata } from "next";
import config from "@/app.config";
import { getLeak } from "@/actions/get-leak";
import { notFound } from "next/navigation";
import UnlockedModel from "@/components/UnlockedModel";
import { LoadMoreAfterId } from "@/components/load-more-after-id";
import ModelDrawer from "@/components/ModelDrawer";
import Notice from "@/components/Notice";
import { getLeaksAfterId } from "@/actions/get-leaks-after-id";
import { cookies } from "next/headers";
import { isRateLimited } from "@/actions/is-rate-limited";
import { currentUser } from "@clerk/nextjs/server";
import { hasValidSubscription } from "@/actions/has-premium-subscription";

type Model = {
  id: string;
  name: string;
  image: string;
  date: string;
  key: string;
};

type Params = Promise<{
  date: string;
  id: string;
  name: string;
}>;

type SearchParams = Promise<{
  token?: string | null;
}>;

export async function generateMetadata(
  { params }: { params: Params },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { date, id, name } = await params;
  const decodedName = decodeURIComponent(name);
  const originalName = decodedName.replace(/-/g, " ");

  return {
    title: `${originalName} Leaks | OnlyFans Content Leaked - DailyDoseOfLeak.com`,
    description: `Explore exclusive OnlyFans nudes leaks of ${originalName} on DailyDoseOfLeak.com. Discover premium content updated regularly.`,
    metadataBase: new URL(`https://www.${config.domain}/${date}/${id}/${name}`),
    keywords: [
      originalName,
      "OnlyFans leaks",
      "nude leaks",
      "exclusive content",
      "leaked videos",
      "premium leaks",
      "OnlyFans nudes",
      `${originalName} leaks`,
      `${originalName} nudes`,
      "leaked OnlyFans content",
    ].join(", "),
    openGraph: {
      title: `${originalName} Leaks | OnlyFans Content Leaked - DailyDoseOfLeak.com`,
      description: `Explore exclusive OnlyFans nudes leaks of ${originalName} on DailyDoseOfLeak.com. Discover premium content updated regularly.`,
      url: new URL(`https://www.${config.domain}/${date}/${id}/${name}`),
      type: "website",
    },
  };
}

export default async function Page({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: SearchParams;
}) {
  const { date, id, name } = await params;
  const { token } = await searchParams;

  const user = await currentUser();
  const isPremium = user ? await hasValidSubscription() : false;
  //const isLimited = await isRateLimited();
  const leakResult = await getLeak(id, token || undefined, isPremium);
  const modelsAfterId = await getLeaksAfterId(
    id,
    1,
    Number(process.env.NEXT_PUBLIC_LOAD_AMOUNT!)
  );

  const models: Model[] = modelsAfterId.map((product) => ({
    id: product.id,
    name: product.name,
    image: product.image,
    date: product.date.toISOString(),
    key: product.redirect,
  }));

  if (!leakResult || !leakResult.leak) {
    return notFound();
  }

  if (isPremium || leakResult.validToken) {
    return (
      <div className="flex flex-1 bg-muted items-center justify-center py-6">
        <MaxWidthWrapper className="space-y-6">
          <UnlockedModel leak={leakResult.leak} isPremium={isPremium} />
          <div>
            <Notice text="/ Hosted on mega.nz" />
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              <ModelDrawer
                models={models}
                isPremium={isPremium}
                year={null}
                month={null}
              />
              <LoadMoreAfterId lastLeakId={id} isPremium={isPremium} />
            </div>
          </div>
        </MaxWidthWrapper>
      </div>
    );
  }

  return (
    <div className="flex flex-1 bg-muted items-center justify-center py-6">
      <MaxWidthWrapper className="space-y-6">
        <UnlockModel
          date={date}
          id={id}
          name={name}
          leak={leakResult.leak}
          isLimited={true}
        />
        <div>
          <Notice text="/ Hosted on mega.nz" />
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            <ModelDrawer
              models={models}
              isPremium={isPremium}
              year={null}
              month={null}
            />
            <LoadMoreAfterId lastLeakId={id} isPremium={isPremium} />
          </div>
        </div>
      </MaxWidthWrapper>
    </div>
  );
}

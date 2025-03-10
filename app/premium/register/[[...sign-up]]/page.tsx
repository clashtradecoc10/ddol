import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import Navbar from "@/components/Navbar";
import PremiumSignIn from "@/components/PremiumSignIn";
import { Suspense } from "react";

const Page = () => {
  return (
    <Suspense>
      <div className="flex-grow flex-1 bg-muted">
        <MaxWidthWrapper>
          <PremiumSignIn isSignIn={false} />
        </MaxWidthWrapper>
      </div>
    </Suspense>
  );
};

export default Page;

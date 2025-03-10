"use client";

import { useEffect, useState } from "react";
import { base64Encode } from "@/lib/utils";
import Link from "next/link";
import config from "@/app.config";
import { Button, buttonVariants } from "./ui/button";
import { useRouter } from "next/navigation";
import { ArrowRightIcon, BookOpen, LockKeyhole } from "lucide-react";
import { limitRate } from "@/actions/is-rate-limited";

const FreeUnlockButton = ({
  originalUrl,
  isRateLimited,
}: {
  originalUrl: string;
  isRateLimited: boolean;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const encodedUrl = base64Encode(originalUrl);
  const monetizedUrl = config.monetizedLinkBase + encodedUrl;

  const router = useRouter();

  async function unlockLeak(isRateLimited: boolean) {
    setIsLoading(true);

    if (isRateLimited) {
      router.push(monetizedUrl);
      setIsLoading(false);
    } else {
      //await limitRate();
      router.push(originalUrl);
      setIsLoading(false);
    }
  }
  return (
    <>
      <Button
        onClick={() => unlockLeak(isRateLimited)}
        className="w-full px-4 py-2 text-sm font-bold text-black bg-pink-400 hover:bg-pink-500 rounded-lg text-center"
        disabled={isLoading}
      >
        {isLoading ? (
          "Unlocking..."
        ) : isRateLimited ? (
          <>
            <p className="flex justify-center">
              Continue with Ads{" "}
              <ArrowRightIcon className="h-5 w-5 pl-1 inline-block" />
            </p>
          </>
        ) : (
          <p className="flex justify-center">
            Daily Free Unlock{" "}
            <ArrowRightIcon className="h-5 w-5 pl-1 inline-block" />
          </p>
        )}
      </Button>
      {isRateLimited && (
        <Link
          href="/tutorials"
          className={buttonVariants({
            className:
              "w-full text-blue-400 hover:bg-blue-50 flex justify-center",
            variant: "ghost",
          })}
        >
          <LockKeyhole className="w-4 h-4 mr-2" />
          How to Unlock with Ads
        </Link>
      )}
    </>
  );
};

export default FreeUnlockButton;

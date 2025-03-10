import Link from "next/link";
import { buttonVariants } from "./ui/button";
import { formatDate, timeAgo } from "@/lib/utils";
import { Leaks } from "@prisma/client";
import config from "@/app.config";
import FreeUnlockButton from "./FreeUnlockButton";

interface UnlockModelProps {
  date: string;
  id: string;
  name: string;
  leak: Leaks;
  isLimited: boolean;
}

const UnlockModel = ({ date, id, name, leak, isLimited }: UnlockModelProps) => {
  const originalUrl = `https://${config.domain}/${id}/${date}/${name}?token=${leak.redirect}`;

  return (
    <div className="flex flex-col items-center relative w-full">
      <div className="w-full px-4">
        <div className="max-w-xl w-full bg-black/80 rounded-lg text-center p-6 z-10 m-auto">
          <h1 className="text-2xl font-bold text-white">
            {leak.name} OnlyFans Leaks
          </h1>
          <h2 className="text-sm text-white">
            Get Access to all Leaks by Completing the Steps on the Ad Page
          </h2>
          <div className="flex flex-col space-y-4 mt-4">
            <Link
              href={"/premium"}
              className="w-full px-4 py-2 text-lg font-bold text-black bg-pink-400 rounded-xl hover:bg-pink-500"
            >
              BUY PREMIUM{" "}
              <span role="img" aria-label="crown">
                💎
              </span>
            </Link>
          </div>
        </div>
      </div>
      <div className="bg-white max-w-lg sm:max-w-3xl w-full mt-[-10px] relative z-20 p-8 shadow-md rounded-lg text-center">
        <div className="mx-auto max-w-md space-y-6 sm:max-w-lg">
          <div className="grid grid-cols-1 gap-6 sm:gap-12 sm:grid-cols-2">
            <div className="flex items-center justify-center">
              <div className="w-full md:h-[330px] relative">
                <img
                  src={`https://d20j5ua5yqolxe.cloudfront.net/${id}.jpg`}
                  className="w-full h-auto md:h-full object-cover object-center rounded-lg"
                />
              </div>
            </div>
            <div className="flex flex-col items-start justify-center space-y-4">
              <div className="text-left space-y-2">
                <h2 className="text-2xl font-bold text-black">{leak.name}</h2>
                <p className="text-sm text-gray-700">{timeAgo(leak.date)}</p>
                <p className="text-sm text-gray-700">{formatDate(leak.date)}</p>
              </div>
              <Link
                href={"/premium"}
                className={buttonVariants({
                  className:
                    "w-full px-4 py-2 text-sm font-bold text-white bg-black rounded-lg",
                })}
              >
                Disable Ads{" "}
                <span role="img" aria-label="crown">
                  👑
                </span>
              </Link>
              <FreeUnlockButton
                originalUrl={originalUrl}
                isRateLimited={isLimited}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnlockModel;

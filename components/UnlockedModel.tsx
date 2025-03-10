"use client";

import Link from "next/link";
import { Leaks } from "@prisma/client";
import { useEffect, useState } from "react";
import megaLinkChecker from "mega-link-checker";
import Loading from "./Loading";
import { cn } from "@/lib/utils";
import config from "@/app.config";

interface UnlockedModelProps {
  leak: Leaks;
  isPremium: boolean;
}

interface LeakData {
  link: string;
  isMegaLink: boolean;
}

const UnlockedModel = ({ leak, isPremium }: UnlockedModelProps) => {
  const [leakData, setLeakData] = useState<LeakData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (leak.leaks) {
          const checkedLeaks = await Promise.all(
            leak.leaks.map(async (link: string) => {
              const isMegaLink = await megaLinkChecker(link);
              return { link, isMegaLink };
            })
          );
          setLeakData(checkedLeaks);
        } else {
          setLeakData([{ link: leak.link, isMegaLink: true }]);
        }
        setLoading(false);
      } catch {
        setLoading(false);
      }
    };

    fetchData();
  }, [leak.leaks]);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="flex flex-col items-center relative w-full">
      <div className="w-full px-4">
        <div className="max-w-xl w-full bg-black/80 rounded-lg text-center p-6 z-10 m-auto">
          <h1 className="text-2xl font-bold text-white">
            {leak.name} OnlyFans Leaks
          </h1>
          <h2 className="text-sm text-white">
            Thanks for using {config.domain}, Enjoy the Leaks below!
          </h2>
          <div className="flex flex-col space-y-4 mt-4">
            <Link
              href={isPremium ? "/" : "/premium"}
              className="w-full px-4 py-2 text-lg font-bold text-black bg-pink-400 rounded-xl hover:bg-pink-500"
            >
              {isPremium ? "MORE LEAKS" : "BUY PREMIUM"}{" "}
              <span role="img" aria-label="crown">
                💎
              </span>
            </Link>
          </div>
        </div>
      </div>
      <div className="bg-white max-w-lg sm:max-w-3xl w-full mt-[-10px] relative z-20 p-8 shadow-md rounded-lg flex flex-col sm:flex-row">
        <div className="w-full sm:w-1/3">
          <div className="flex items-center justify-center">
            <div className="w-full md:h-[330px] relative">
              <img
                src={`https://d20j5ua5yqolxe.cloudfront.net/${leak.id}.jpg`}
                className="w-full h-auto md:h-full object-cover object-center rounded-lg"
              />
            </div>
          </div>
        </div>
        <div className="w-full sm:w-2/3 sm:pl-6 mt-6 sm:mt-0 flex flex-col justify-center">
          <h2 className="text-2xl font-bold text-black">{leak.name}</h2>

          <div
            className="h-full w-full max-h-[18rem] min-h-40 p-4 bg-gray-100 mt-2 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-400 overflow-y-auto whitespace-pre-wrap break-all break-words"
            contentEditable={false}
          >
            {leakData.map((leak, index) => (
              <a
                key={index}
                href={leak.link}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "hover:underline block",
                  index !== 0 && "mt-1",
                  leak.isMegaLink ? "text-[#7273d8]" : "text-red-500"
                )}
              >
                {leak.link}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnlockedModel;

import Link from "next/link";
import config from "@/app.config";

const BuyPremium = ({
  isLoggedIn,
  isPremium,
}: {
  isLoggedIn: boolean;
  isPremium: boolean;
}) => {
  return (
    <div className="mx-auto w-full max-w-xl p-6 bg-black/80 rounded-lg text-center">
      <h1 className="text-2xl font-bold text-white">
        Welcome to {config.name}
      </h1>
      <h2 className="text-sm text-white">
        Your Best Place for Free OnlyFans Leaks.
      </h2>
      <div className="flex flex-col space-y-4 mt-4">
        <Link
          href={"/premium"}
          className="w-full px-4 py-2 text-lg font-bold text-white bg-black rounded-xl hover:bg-gray-800"
        >
          {isPremium ? "MANAGE MEMBERSHIP" : "BUY PREMIUM"}{" "}
          <span role="img" aria-label="crown">
            👑
          </span>
        </Link>
        <Link
          href={isPremium ? "/archive" : "/premium/login"}
          className="w-full px-4 py-2 text-lg font-bold text-black bg-pink-400 rounded-xl hover:bg-pink-500"
        >
          {isLoggedIn ? "ARCHIVE" : "PREMIUM LOGIN"}{" "}
          <span role="img" aria-label="person">
            {isLoggedIn ? "📦" : "👤"}
          </span>
        </Link>
      </div>
    </div>
  );
};

export default BuyPremium;

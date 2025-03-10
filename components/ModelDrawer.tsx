import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import { timeAgo } from "@/lib/utils";

interface ModelDrawerProps {
  models: {
    id: string;
    name: string;
    image: string;
    date: string;
    key: string;
  }[];
  isPremium: boolean;
  year: number | null;
  month: number | null;
}

const ModelDrawer = ({ models, isPremium }: ModelDrawerProps) => {
  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    return `${year}-${month}`;
  };

  const formatNameForUrl = (name: string) => {
    return name.replace(/\s+/g, "-");
  };

  return (
    <>
      {models && models.length > 0 ? (
        models.map((item) => {
          const formattedDate = formatDate(new Date(item.date));
          const formattedName = formatNameForUrl(item.name);
          const modelUrl = `/${item.id}/${formattedDate}/${encodeURIComponent(
            formattedName
          )}`;

          return (
            <div
              key={item.id}
              className="p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col justify-between h-full"
            >
              <Link
                title={`View all leaked content of ${item.name} on OnlyFans`}
                href={modelUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <img
                  src={`https://dxy6x8yqcf5mp.cloudfront.net/OnlyfansmegaSFW/${item.image}`}
                  className="w-full h-[250px] object-cover object-center rounded-lg"
                />
              </Link>
              <div className="flex-grow">
                <h3 className="mt-2 text-lg font-bold break-words">
                  {item.name}
                </h3>
                <p className="text-sm text-gray-400">
                  {timeAgo(new Date(item.date))}
                </p>
                <p className="text-sm text-gray-400">
                  {new Date(item.date).toISOString().split("T")[0]}
                </p>
              </div>
              <div className="flex flex-col space-y-2 mt-4">
                {isPremium === false && (
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
                )}
                <Link
                  title={`View all leaked content of ${item.name}`}
                  href={modelUrl}
                  className="w-full px-4 py-2 text-sm font-bold text-black bg-pink-400 rounded-lg text-center"
                >
                  View Leaks
                </Link>
              </div>
            </div>
          );
        })
      ) : (
        <></>
      )}
    </>
  );
};

export default ModelDrawer;

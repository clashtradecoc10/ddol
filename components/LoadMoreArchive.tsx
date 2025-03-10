"use client";

import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { Spinner } from "@/components/ui/spinner";
import archive from "@/public/archive.json";

const LoadMoreArchive = () => {
  const [visibleItems, setVisibleItems] = useState(12);
  const [isLoading, setIsLoading] = useState(false);
  const { ref, inView } = useInView();

  const loadMoreItems = () => {
    setIsLoading(true);
    setTimeout(() => {
      setVisibleItems((prev) => prev + 12);
      setIsLoading(false);
    }, 1000);
  };

  useEffect(() => {
    if (inView && !isLoading && visibleItems < archive.length) {
      loadMoreItems();
    }
  }, [inView]);

  return (
    <>
      {archive.slice(12, visibleItems).map((item) => (
        <a
          key={`${item.year}-${item.month_numeric}`}
          href={`/archive/${item.year}-${item.month_numeric}`}
        >
          <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
            <div className="grid grid-cols-4 gap-2">
              {item.image_paths.slice(0, 12).map((photo) => (
                <img
                  key={photo}
                  src={`https://dxy6x8yqcf5mp.cloudfront.net/OnlyfansmegaSFW/${photo}`}
                  className="w-full h-[100px] object-cover object-center"
                />
              ))}
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold">{`${item.month_textual} ${item.year}`}</h3>
              <p className="text-muted-foreground">{item.count} leaks</p>
            </div>
          </div>
        </a>
      ))}
      <div
        ref={ref}
        className="flex justify-center items-center p-4 col-span-1 sm:col-span-2 md:col-span-3 lg:col-span-4"
      >
        {isLoading && <Spinner />}
      </div>
    </>
  );
};

export default LoadMoreArchive;

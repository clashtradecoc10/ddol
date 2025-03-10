"use client";

import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { Spinner } from "@/components/ui/spinner";
import { Leaks } from "@prisma/client";
import ModelDrawer from "./ModelDrawer";
import { getLeaksAfterId } from "@/actions/get-leaks-after-id";

type Model = {
  id: string;
  name: string;
  date: string;
  key: string;
};

export function LoadMoreAfterId({
  lastLeakId,
  isPremium,
}: {
  lastLeakId: string;
  isPremium: boolean;
}) {
  const [models, setModels] = useState<Model[]>([]);
  const [page, setPage] = useState(1);

  const { ref, inView } = useInView();

  const loadMoreModels = async () => {
    const nextPage = page + 1;
    const newProducts: Leaks[] =
      (await getLeaksAfterId(
        lastLeakId,
        nextPage,
        Number(process.env.NEXT_PUBLIC_LOAD_AMOUNT!)
      )) ?? [];
    const formattedProducts: Model[] = newProducts.map((product) => ({
      id: product.id,
      name: product.name,
      date: product.date.toISOString(),
      key: product.redirect,
    }));
    setModels((prevProducts) => [...prevProducts, ...formattedProducts]);
    setPage(nextPage);
  };

  useEffect(() => {
    if (inView) {
      loadMoreModels();
    }
  }, [inView]);

  return (
    <>
      <ModelDrawer
        models={models}
        isPremium={isPremium}
        year={null}
        month={null}
      />
      <div
        className="flex justify-center items-center p-4 col-span-2 sm:col-span-3 md:col-span-4 lg:col-span-6"
        ref={ref}
      >
        <Spinner />
      </div>
    </>
  );
}

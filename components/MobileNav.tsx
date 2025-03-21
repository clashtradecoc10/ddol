"use client";

import { ArrowRight, Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const MobileNav = () => {
  const [isOpen, setOpen] = useState<boolean>(false);

  const toggleOpen = () => setOpen((prev) => !prev);

  const pathname = usePathname();

  useEffect(() => {
    if (isOpen) toggleOpen();
  }, [pathname]);

  const closeOnCurrent = (href: string) => {
    if (pathname === href) {
      toggleOpen();
    }
  };

  return (
    <div className="sm:hidden">
      <Menu
        onClick={toggleOpen}
        className="relative z-50 h-5 w-5 text-zinc-700"
      />

      {isOpen ? (
        <div className="fixed animate-in slide-in-from-top-5 fade-in-20 inset-0 z-30 w-full">
          <ul className="absolute bg-white border-b border-zinc-200 shadow-xl grid w-full gap-3 px-4 pt-20 pb-8">
            <li>
              <Link
                onClick={() => closeOnCurrent("/premium/login")}
                className="flex items-center w-full font-semibold text-pink-400"
                href="/premium/login"
              >
                Login
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </li>
            <li className="my-3 h-px w-full bg-gray-300" />
            <li>
              <a href="/archive">Archive</a>
            </li>
            <li className="my-3 h-px w-full bg-gray-300" />
            <li>
              <a href="/dmca">DMCA</a>
            </li>
            <li className="my-3 h-px w-full bg-gray-300" />
            <li>
              <a
                href="https://theporndude.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                ThePornDude
              </a>
            </li>
          </ul>
        </div>
      ) : null}
    </div>
  );
};

export default MobileNav;

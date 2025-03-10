import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import MaxWidthWrapper from "./MaxWidthWrapper";
import MobileNav from "./MobileNav";
import config from "@/app.config";
import Link from "next/link";

const Navbar = () => {
  return (
    <header className="bg-white">
      <MaxWidthWrapper className="flex items-center justify-between p-4">
        <Link href="/" className="z-50">
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold">
              <span className="text-black">{config.name1}</span>
              <span className="text-pink-400">{config.name2}</span>
            </h1>
          </div>
        </Link>

        <MobileNav />

        <nav className="hidden sm:flex space-x-4 text-sm text-pink-400 items-center justify-center">
          <SignedOut>
            <a href="/premium/login" className="hover:underline">
              Login
            </a>
          </SignedOut>
          <a href="/archive" className="hover:underline">
            Archive
          </a>
          <a href="/dmca" className="hover:underline">
            DMCA
          </a>
          <a
            href="https://theporndude.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            ThePornDude
          </a>
          <UserButton />
        </nav>
      </MaxWidthWrapper>
    </header>
  );
};

export default Navbar;

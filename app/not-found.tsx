import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { Button, buttonVariants } from "@/components/ui/button";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-1 bg-muted items-center justify-center py-6">
      <MaxWidthWrapper>
        <div className="flex flex-col items-center justify-center">
          <div className="flex flex-col items-center justify-center bg-white p-8 rounded-lg shadow-md w-full max-w-2xl text-center">
            <h1 className="text-4xl font-bold text-gray-800">
              Oops! Page Not Found
            </h1>
            <p className="text-gray-500 mt-4">
              The page you&apos;re looking for doesn&apos;t exist.
            </p>
            <Link
              href={"/"}
              className={buttonVariants({
                size: "lg",
                className: "mt-6 !bg-pink-400 text-white py-2 px-4",
              })}
            >
              Go Back Home
            </Link>
          </div>
        </div>
      </MaxWidthWrapper>
    </div>
  );
}

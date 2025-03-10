import Link from "next/link";
import { Button, buttonVariants } from "./ui/button";
import config from "@/app.config";

const DMCANotice = () => {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="flex flex-col items-center justify-center bg-white p-8 rounded-lg shadow-md w-full max-w-3xl text-center">
        <h1 className="text-4xl font-bold text-gray-800">
          Disclaimer and DMCA
        </h1>
        <p className="mt-4 text-gray-500">
          {config.domain} is a website that offers a collection of publicly
          available adult content. All posts are freely available and are not
          uploaded by us; no content is hosted on our servers.{" "}
          {/*If you believe
          that your copywritten work has been copied in a way that constitutes
          copyright infringement, please contact via{" "}
          <Link className="underline text-blue-600" href={config.telegram}>
            telegram
          </Link>
          .*/}
        </p>
        <Link
          href={"/"}
          className={buttonVariants({
            size: "lg",
            className: "mt-6 !bg-pink-400 text-white py-2 px-4",
          })}
        >
          FREE PACKS
        </Link>
      </div>
    </div>
  );
};

export default DMCANotice;

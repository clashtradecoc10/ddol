import config from "@/app.config";

const Footer = () => {
  return (
    <footer className="bg-white">
      <div className="mx-auto max-w-screen-xl px-4 pb-8 sm:px-6 lg:px-8">
        <div className="border-t border-gray-100 pt-8">
          <p className="text-center text-xs/relaxed text-gray-500">
            © {config.name} {config.currentYear}. All rights reserved.
            <br />
            By{" "}
            <a
              href="/"
              className="text-gray-700 underline transition hover:text-gray-700/75"
            >
              {config.domain}
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

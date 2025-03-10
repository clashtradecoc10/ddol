import { MetadataRoute } from "next";
import config from "@/app.config";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `https://www.${config.domain}/sitemap.xml`,
  };
}

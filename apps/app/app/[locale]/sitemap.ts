import type { MetadataRoute } from "next";
import { env } from "@/env";
import { getMarketingPages } from "@/utils/sitemap/get-marketing-pages";

const url = env.NEXT_PUBLIC_APP_URL;
const marketingPages = getMarketingPages();

const sitemap = async (): Promise<MetadataRoute.Sitemap> => [
  // 营销页面
  ...marketingPages.map((page) => ({
    url: new URL(page, url).href,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: page === "/" ? 1.0 : 0.8,
  })),
];

export default sitemap;

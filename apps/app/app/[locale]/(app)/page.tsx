import { getDictionary } from "@repo/internationalization";
import { createMetadata } from "@repo/seo/metadata";
import type { Metadata } from "next";

type HomeProps = {
  params: Promise<{
    locale: string;
  }>;
};

export const generateMetadata = async ({
  params,
}: HomeProps): Promise<Metadata> => {
  const { locale } = await params;
  const dictionary = await getDictionary(locale);

  return createMetadata({
    ...dictionary.web.home.meta,
    path: "/",
  });
};

export default function Home() {
  return (
    <div className="flex h-(--screen-height-minus-header) items-center justify-center">
      Home
    </div>
  );
}

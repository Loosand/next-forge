import { getDictionary } from "@repo/internationalization";
import type { ReactNode } from "react";
import { Footer } from "../_components/footer";
import { Header } from "../_components/header";

type LocaleLayoutProperties = {
  readonly children: ReactNode;
  readonly params: Promise<{
    locale: string;
  }>;
};

const LocaleLayout = async ({ children, params }: LocaleLayoutProperties) => {
  const { locale } = await params;
  const dictionary = await getDictionary(locale);

  return (
    <>
      <Header dictionary={dictionary} />
      {children}
      <Footer />
    </>
  );
};

export default LocaleLayout;

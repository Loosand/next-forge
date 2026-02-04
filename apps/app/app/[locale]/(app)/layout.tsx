import type { ReactNode } from "react";
import { Footer } from "../_components/footer";
import { Header } from "../_components/header";

type LocaleLayoutProperties = {
  readonly children: ReactNode;
  readonly params: Promise<{
    locale: string;
  }>;
};

const LocaleLayout = async ({ children, params }: LocaleLayoutProperties) => (
  <>
    <Header />
    {children}
    <Footer />
  </>
);

export default LocaleLayout;

import type { ReactNode } from "react";
import { Header } from "../_components/header";
import { MobileMenu } from "../_components/mobile-menu";

type LocaleLayoutProperties = {
  readonly children: ReactNode;
  readonly params: Promise<{
    locale: string;
  }>;
};

const LocaleLayout = async ({ children, params }: LocaleLayoutProperties) => (
  <div className="dark:bg-black">
    <Header />
    {children}
    <MobileMenu />
  </div>
);

export default LocaleLayout;

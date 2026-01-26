import { ModeToggle } from "@repo/design-system/components/mode-toggle";
import type { ReactNode } from "react";

type AuthLayoutProps = {
  readonly children: ReactNode;
};

const AuthLayout = ({ children }: AuthLayoutProps) => (
  <div className="container relative grid h-dvh flex-col items-center justify-center lg:max-w-none lg:grid-cols-2 lg:px-0">
    <div className="lg:p-8">
      <div className="mx-auto flex w-full max-w-[400px] flex-col justify-center space-y-6">
        {children}
      </div>
    </div>
    <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
      <div className="absolute top-4 right-4">
        <ModeToggle />
      </div>
    </div>
  </div>
);

export default AuthLayout;

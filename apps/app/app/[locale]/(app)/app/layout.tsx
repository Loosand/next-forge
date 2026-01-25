import { auth } from "@repo/auth/server";
import { secure } from "@repo/security";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { env } from "@/env";

type AppLayoutProperties = {
  readonly children: ReactNode;
};

const AppLayout = async ({ children }: AppLayoutProperties) => {
  if (env.ARCJET_KEY) {
    await secure(["CATEGORY:PREVIEW"]);
  }

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/sign-in");
  }

  return <div>{children}</div>;
};

export default AppLayout;

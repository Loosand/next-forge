import { createMetadata } from "@repo/seo/metadata";
import type { Metadata } from "next";
import dynamic from "next/dynamic";

const title = "Welcome back";
const description = "Enter your details to sign in.";
const SignIn = dynamic(() =>
  import("@repo/auth/components/sign-in").then((mod) => mod.SignIn)
);

export const metadata: Metadata = createMetadata({
  title,
  description,
  path: "/auth/sign-in",
});

type SignInPageProps = {
  readonly params: Promise<{ locale: string }>;
};

const SignInPage = async ({ params }: SignInPageProps) => <SignIn />;

export default SignInPage;

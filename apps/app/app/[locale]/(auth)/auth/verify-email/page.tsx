import { createMetadata } from "@repo/seo/metadata";
import type { Metadata } from "next";
import dynamic from "next/dynamic";

const title = "Verify Your Email";
const description = "Enter the verification code sent to your email.";
const VerifyOTP = dynamic(() =>
  import("@repo/auth/components/verify-otp").then((mod) => mod.VerifyOTP)
);

export const metadata: Metadata = createMetadata({
  title,
  description,
  path: "/auth/verify-email",
});

const VerifyEmailPage = () => <VerifyOTP />;

export default VerifyEmailPage;

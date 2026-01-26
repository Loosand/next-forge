"use client";

import { emailOTPClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  plugins: [emailOTPClient()],
});

export const { signIn, signOut, signUp, useSession, emailOtp } = authClient;

export { SignIn } from "./components/sign-in";
export { SignUp } from "./components/sign-up";
// Re-export components
export { UserMenu } from "./components/user-menu";

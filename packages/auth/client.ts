"use client";

import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient();

export const { signIn, signOut, signUp, useSession } = authClient;

export { SignIn } from "./components/sign-in";
export { SignUp } from "./components/sign-up";
// Re-export components
export { UserMenu } from "./components/user-menu";

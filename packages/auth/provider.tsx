"use client";

import type { ReactNode } from "react";

type AuthProviderProperties = {
  children: ReactNode;
  privacyUrl?: string;
  termsUrl?: string;
  helpUrl?: string;
};

// Better Auth doesn't require a provider wrapper like Clerk
// This is a passthrough component for compatibility
export const AuthProvider = ({ children }: AuthProviderProperties) => children;

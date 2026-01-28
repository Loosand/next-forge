"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { emailOtp, signUp } from "../client";

export const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signUp.email({
        name,
        email,
        password,
      });

      if (result.error) {
        // If user already exists, try to send verification OTP
        // This handles the case where user registered but never verified
        if (result.error.code === "USER_ALREADY_EXISTS") {
          try {
            await emailOtp.sendVerificationOtp({
              email,
              type: "email-verification",
            });
            // OTP sent successfully, user exists but not verified
            router.push(`/auth/verify-email?email=${encodeURIComponent(email)}`);
            return;
          } catch {
            // OTP send failed, user is likely already verified
            setError("An account with this email already exists. Please sign in.");
            return;
          }
        }
        setError(result.error.message || "Sign up failed");
      } else {
        // Redirect to OTP verification page
        router.push(`/auth/verify-email?email=${encodeURIComponent(email)}`);
      }
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-sm space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="font-bold text-2xl">Create Account</h1>
        <p className="text-muted-foreground">
          Enter your details to create a new account
        </p>
      </div>
      <form className="space-y-6" onSubmit={handleSubmit}>
        {error && (
          <div className="rounded-md bg-destructive/10 p-3 text-destructive text-sm">
            {error}
          </div>
        )}
        <div className="space-y-2">
          <label className="block font-medium text-sm" htmlFor="name">
            Name
          </label>
          <input
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            id="name"
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            required
            type="text"
            value={name}
          />
        </div>
        <div className="space-y-2">
          <label className="block font-medium text-sm" htmlFor="email">
            Email
          </label>
          <input
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            id="email"
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            type="email"
            value={email}
          />
        </div>
        <div className="space-y-2">
          <label className="block font-medium text-sm" htmlFor="password">
            Password
          </label>
          <input
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            id="password"
            minLength={8}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Create a password"
            required
            type="password"
            value={password}
          />
        </div>

        <button
          className="w-full rounded-md bg-primary px-4 py-2 font-medium text-primary-foreground text-sm hover:bg-primary/90 disabled:opacity-50"
          disabled={loading}
          type="submit"
        >
          {loading ? "Creating account..." : "Sign Up"}
        </button>
      </form>
      <p className="mt-2 text-center text-muted-foreground text-sm">
        Already have an account?{" "}
        <a className="text-primary hover:underline" href="/auth/sign-in">
          Sign in
        </a>
      </p>
    </div>
  );
};

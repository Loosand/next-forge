"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { emailOtp } from "../client";

export const VerifyOTP = () => {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await emailOtp.verifyEmail({
        email,
        otp,
      });

      if (result.error) {
        setError(result.error.message || "Verification failed");
      } else {
        router.push("/");
        router.refresh();
      }
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError("");
    setResending(true);

    try {
      const result = await emailOtp.sendVerificationOtp({
        email,
        type: "email-verification",
      });

      if (result.error) {
        setError(result.error.message || "Failed to resend code");
      }
    } catch {
      setError("Failed to resend code");
    } finally {
      setResending(false);
    }
  };

  if (!email) {
    return (
      <div className="mx-auto w-full max-w-sm space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="font-bold text-2xl">Invalid Request</h1>
          <p className="text-muted-foreground">
            No email address provided. Please{" "}
            <a className="text-primary hover:underline" href="/auth/sign-up">
              sign up
            </a>{" "}
            again.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-sm space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="font-bold text-2xl">Verify Your Email</h1>
        <p className="text-muted-foreground">
          We sent a verification code to{" "}
          <span className="font-medium text-foreground">{email}</span>
        </p>
      </div>
      <form className="space-y-6" onSubmit={handleSubmit}>
        {error && (
          <div className="rounded-md bg-destructive/10 p-3 text-destructive text-sm">
            {error}
          </div>
        )}
        <div className="space-y-2">
          <label className="block font-medium text-sm" htmlFor="otp">
            Verification Code
          </label>
          <input
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-center text-sm tracking-widest placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            id="otp"
            maxLength={6}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
            placeholder="000000"
            required
            type="text"
            value={otp}
          />
        </div>

        <button
          className="w-full rounded-md bg-primary px-4 py-2 font-medium text-primary-foreground text-sm hover:bg-primary/90 disabled:opacity-50"
          disabled={loading || otp.length !== 6}
          type="submit"
        >
          {loading ? "Verifying..." : "Verify Email"}
        </button>
      </form>
      <p className="text-center text-muted-foreground text-sm">
        Didn't receive the code?{" "}
        <button
          className="text-primary hover:underline disabled:opacity-50"
          disabled={resending}
          onClick={handleResend}
          type="button"
        >
          {resending ? "Sending..." : "Resend"}
        </button>
      </p>
    </div>
  );
};

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { sendVerificationEmail } from "@/lib/auth-client";
import { Button } from "@/components/ui/Button";

import { useLoggedInUser } from "@/hooks/useLoggedInUser";

export function VerifyEmail({ token, error }: { token: string | undefined, error: string | undefined }) {
  const router = useRouter();
  const { user } = useLoggedInUser()

  const [status, setStatus] = useState<"loading" | "success" | "error" | "pending">("loading");
  const [message, setMessage] = useState("");
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    if (error) {
      setStatus("error");
      setMessage("The verification link is invalid or has expired.");
    } else if (token) {
      setStatus("success");
      setMessage("Your email has been verified successfully!");
      setTimeout(() => {
        router.push("/dashboard");
      }, 3000);
    } else {
      setStatus("pending");
      setMessage("Please check your email for the verification link.");
    }
  }, [token, error, router]);

  const handleResendEmail = async () => {
    setIsResending(true);
    try {
      await sendVerificationEmail({
        email: user?.email || "",
      });
      setMessage("Verification email sent! Please check your inbox.");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setMessage(err.message);
        return;
      }
      setMessage("Failed to resend verification email. Please try again.");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        {status === "loading" && (
          <>
            <div className="mx-auto w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
            <h2 className="text-2xl font-bold text-gray-900">Verifying your email...</h2>
          </>
        )}

        {status === "success" && (
          <>
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="text-3xl font-extrabold text-gray-900">Email Verified!</h2>
            <p className="text-gray-600">{message}</p>
            <p className="text-sm text-gray-500">Redirecting to dashboard...</p>
            <Link
              href="/dashboard"
              className="inline-block text-indigo-600 hover:text-indigo-500 font-medium"
            >
              Go to dashboard now →
            </Link>
          </>
        )}

        {status === "error" && (
          <>
            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <h2 className="text-3xl font-extrabold text-gray-900">Verification Failed</h2>
            <p className="text-charcoal">{message}</p>
            <div className="space-y-4">
              <Button
                onClick={handleResendEmail}
                disabled={isResending}
                className="text-warm-gray-dark hover:text-charcoal transition-colors"
              >
                {isResending ? "Sending..." : "Resend verification email"}
              </Button>
              <div>
                <Link
                  href="/login"
                  className="text-indigo-600 hover:text-indigo-500 font-medium"
                >
                  ← Back to login
                </Link>
              </div>
            </div>
          </>
        )}

        {status === "pending" && (
          <>
            <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-warm-gray-dark"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h2 className="text-3xl font-extrabold text-gray-900">Verify Your Email</h2>
            <p className="text-gray-600">{message}</p>
            {user?.email && (
              <p className="text-sm text-gray-500">
                We sent an email to <strong>{user.email}</strong>
              </p>
            )}
            <div className="space-y-4 pt-4">
              <Button
                onClick={handleResendEmail}
                disabled={isResending}
              >
                {isResending ? "Sending..." : "Resend verification email"}
              </Button>
              <div>
                <Link
                  href="/login"
                  className="text-sm text-warm-gray-dark hover:text-charcoal transition-colors"
                >
                  ← Back to login
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
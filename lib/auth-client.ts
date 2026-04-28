// lib/auth-client.ts
import { createAuthClient } from "better-auth/react";
import { adminClient, inferAdditionalFields } from "better-auth/client/plugins";
import { auth } from "./auth";

const baseURL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export const authClient = createAuthClient({
  baseURL,
  plugins: [adminClient(), inferAdditionalFields<typeof auth>()],
});

// Export common methods
export const { signIn, signUp, signOut, useSession, getSession } = authClient;

// For password reset - use the fetch API directly if methods aren't available
export async function forgetPassword({ email, redirectTo }: { email: string; redirectTo: string }) {
  try {
    const response = await fetch(`${baseURL}/api/auth/forget-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, redirectTo }),
    });

    const data = await response.json();

    if (!response.ok) {
      return { error: { message: data.message || "Failed to send reset email" } };
    }

    return { data, error: null };
  } catch (error: unknown) {
    if (error instanceof Error) {
      return { error: { message: error.message } };
    }
    return { error: { message: "An unexpected error occurred" } };
  }
}

export async function resetPassword({ newPassword, token }: { newPassword: string; token: string }) {
  try {
    const response = await fetch(`${baseURL}/api/auth/reset-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ newPassword, token }),
    });

    const data = await response.json();

    if (!response.ok) {
      return { error: { message: data.message || "Failed to reset password" } };
    }

    return { data, error: null };
  } catch (error: unknown) {
    if (error instanceof Error) {
      return { error: { message: error.message } };
    }
    return { error: { message: "An unexpected error occurred" } };
  }
}

export async function sendVerificationEmail({ email }: { email: string }) {
  try {
    const response = await fetch(`${baseURL}/api/auth/send-verification-email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();

    if (!response.ok) {
      return { error: { message: data.message || "Failed to send verification email" } };
    }

    return { data, error: null };
  } catch (error) {
    if (error instanceof Error) {
      return { error: { message: error.message } };
    }
    return { error: { message: "An unexpected error occurred" } };
  }
}
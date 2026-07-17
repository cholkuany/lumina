import { getServerSession } from "@/lib/auth-server";
import LoginForm from "./loginForm";
import { redirect } from "next/navigation";
import { getSafeRedirectPath } from '@/utils/getSafeRedirectPath'
import { RedirectProps } from '@/lib/types'

export default async function LoginPage({ searchParams }: RedirectProps) {
  const session = await getServerSession();
  const requestedRedirect = (await searchParams)?.redirectTo
  const signedInRedirectTo = getSafeRedirectPath(requestedRedirect, "/")
  const loginSuccessRedirectTo = getSafeRedirectPath(requestedRedirect, "/account")

  if (session) {
    redirect(signedInRedirectTo);
  }

  return <LoginForm redirectTo={loginSuccessRedirectTo} />;
}

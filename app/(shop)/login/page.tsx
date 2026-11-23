import { getServerSession } from "@/lib/auth-server";
import LoginForm from "./loginForm";
import { redirect } from "next/navigation";
import { getSafeRedirectPath } from '@/utils/getSafeRedirectPath'
import { RedirectProps } from '@/lib/types'

export default async function LoginPage({ searchParams }: RedirectProps) {
  const session = await getServerSession();
  const requestedRedirect = (await searchParams)?.callbackUrl
  console.log('Redirect login page =>>', requestedRedirect)
  const signedInRedirectTo = getSafeRedirectPath(requestedRedirect, "/")
  // const loginSuccessRedirectTo = getSafeRedirectPath(requestedRedirect, "/")
  console.log('Redirect safeRedirect login page =>>', signedInRedirectTo)

  if (session) {
    redirect(signedInRedirectTo);
  }

  return <LoginForm redirectTo={signedInRedirectTo} />;
}

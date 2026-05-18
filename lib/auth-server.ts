import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from 'next/navigation'

export async function getServerSession() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    })
    return session
  } catch {
    return null
  }
}

export async function requireServerSession() {
  const session = await getServerSession();

  if (!session?.user) {
    redirect("/login");
  }

  return session;
}
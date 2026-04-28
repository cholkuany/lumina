import { getServerSession } from "@/lib/auth-server";
import LoginForm from "./loginForm";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  const session = await getServerSession();

  if (session) {
    redirect("/");
  }

  return <LoginForm />;
}

import { VerifyEmail } from "./VerifyEmail";

export default async function VerifyEmailPage({ searchParams }: { searchParams: Promise<{ token?: string; error?: string }> }) {
  const { token, error } = await searchParams

  return (
    <VerifyEmail
      error={error}
      token={token}
    />
  );
}
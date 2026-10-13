"use client";

import { signOut } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { LogOut } from "lucide-react";

export function SignOutButton({ closeMenu }: { closeMenu?: () => void }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      await signOut();
      closeMenu?.();
      router.push("/");
      router.refresh();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="border-t border-border-light p-2">
      <button
        onClick={handleSignOut}
        disabled={isLoading}
        className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-red-600 transition-colors hover:bg-red-50 focus-visible:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold disabled:opacity-50"
      >
        <LogOut className="h-4 w-4 shrink-0" aria-hidden="true" />
        {isLoading ? "Signing Out..." : "Sign Out"}
      </button>
    </div>
  );
}
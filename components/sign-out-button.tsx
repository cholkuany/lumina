// components/sign-out-button.tsx
"use client";

import { signOut } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { LogOut } from 'lucide-react'

export function SignOutButton({ closeMenu }: { closeMenu?: () => void }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignOut = async () => {
    setIsLoading(true);
    await signOut();
    closeMenu?.()
    router.push("/");
    router.refresh();
  };

  return (
    <div className="p-2 border-t border-warm-gray-light">
      <button
        onClick={handleSignOut}
        disabled={isLoading}
        className="flex items-center gap-3 px-3 py-2.5 rounded-brand text-sm text-red-600 hover:bg-red-50 transition-colors w-full disabled:opacity-50"
      >
        <LogOut className="w-4 h-4" />
        {isLoading ? "Signing Out..." : "Sign Out"}
      </button>
    </div>
  );
}
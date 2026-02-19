"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { BottomNav } from "@/components/layout/BottomNav";
import { useUserStore } from "@/stores/user-store";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const profile = useUserStore((s) => s.profile);

  useEffect(() => {
    if (!profile?.onboardingComplete) {
      router.replace("/onboarding");
    }
  }, [profile, router]);

  if (!profile?.onboardingComplete) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <>
      {children}
      <BottomNav />
    </>
  );
}

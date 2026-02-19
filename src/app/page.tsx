"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Camera, CalendarDays, TrendingUp, Dumbbell, Leaf, Zap } from "lucide-react";
import { useUserStore } from "@/stores/user-store";

export default function Home() {
  const router = useRouter();
  const profile = useUserStore((s) => s.profile);

  useEffect(() => {
    if (profile?.onboardingComplete) {
      router.replace("/dashboard");
    }
  }, [profile, router]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6">
      <div className="w-full max-w-md space-y-10">
        {/* Logo & Hero */}
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10 mb-2">
            <Dumbbell className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight">
            Gym<span className="text-primary">Fuel</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-xs">
            Your AI-Powered Diet Companion
          </p>
          <p className="text-sm text-muted-foreground/80 max-w-sm">
            Scan your groceries, photograph your fridge, and get personalized
            meal plans that match your fitness goals
          </p>
        </div>

        {/* Feature Highlights */}
        <div className="space-y-3">
          <FeatureCard
            icon={<Camera className="h-5 w-5 text-primary" />}
            title="Scan & Recognize"
            description="Take a photo of your receipt or fridge and let AI identify your ingredients"
          />
          <FeatureCard
            icon={<CalendarDays className="h-5 w-5 text-primary" />}
            title="Smart Meal Plans"
            description="Weekly plans tailored to your macros, goals, and available ingredients"
          />
          <FeatureCard
            icon={<TrendingUp className="h-5 w-5 text-primary" />}
            title="Track Progress"
            description="Monitor nutrition, weight, and progress with beautiful charts"
          />
        </div>

        {/* CTA */}
        <div className="space-y-3">
          <Link href="/onboarding" className="block">
            <Button className="w-full h-12 text-base font-semibold" size="lg">
              <Zap className="mr-2 h-5 w-5" />
              Get Started
            </Button>
          </Link>
          <p className="text-center text-xs text-muted-foreground">
            <Leaf className="inline h-3 w-3 mr-1" />
            Evidence-based nutrition science
          </p>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-4 rounded-xl border border-border/50 bg-card/50 p-4 transition-colors hover:bg-card">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
        {icon}
      </div>
      <div>
        <h3 className="font-semibold text-sm">{title}</h3>
        <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
      </div>
    </div>
  );
}

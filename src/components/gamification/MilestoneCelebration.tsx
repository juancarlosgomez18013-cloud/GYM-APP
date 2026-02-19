"use client";

import { useEffect, useState } from "react";
import { Trophy, X, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGamificationStore } from "@/stores/gamification-store";
import { useDailyLogStore } from "@/stores/daily-log-store";

const MILESTONES = [3, 7, 14, 21, 30, 60, 90, 100, 365];

const MILESTONE_MESSAGES: Record<number, { title: string; message: string }> = {
  3: { title: "Great Start!", message: "3 days tracking! You're building a habit." },
  7: { title: "One Week!", message: "7 days in a row! You're on fire!" },
  14: { title: "Two Weeks!", message: "14 days of consistency. Keep it up!" },
  21: { title: "Habit Formed!", message: "21 days! They say it takes 21 days to form a habit." },
  30: { title: "One Month!", message: "30 days strong! You're unstoppable." },
  60: { title: "Two Months!", message: "60 days of dedication. Incredible!" },
  90: { title: "Quarter Year!", message: "90 days! A true lifestyle change." },
  100: { title: "Century!", message: "100 days! You're in the elite club." },
  365: { title: "One Year!", message: "365 days! A full year of tracking. Legend!" },
};

export function MilestoneCelebration() {
  const [showCelebration, setShowCelebration] = useState(false);
  const [currentMilestone, setCurrentMilestone] = useState(0);

  const lastCelebrated = useGamificationStore((s) => s.lastCelebratedMilestone);
  const setLastCelebrated = useGamificationStore(
    (s) => s.setLastCelebratedMilestone
  );
  const getCurrentStreak = useDailyLogStore((s) => s.getCurrentStreak);

  useEffect(() => {
    const streak = getCurrentStreak();

    // Find the highest milestone the streak has reached
    const reachedMilestone = [...MILESTONES]
      .reverse()
      .find((m) => streak >= m);

    if (reachedMilestone && reachedMilestone > lastCelebrated) {
      setCurrentMilestone(reachedMilestone);
      setShowCelebration(true);
    }
  }, [getCurrentStreak, lastCelebrated]);

  const handleDismiss = () => {
    setShowCelebration(false);
    setLastCelebrated(currentMilestone);
  };

  if (!showCelebration) return null;

  const info = MILESTONE_MESSAGES[currentMilestone] ?? {
    title: `${currentMilestone} Days!`,
    message: `You've tracked for ${currentMilestone} consecutive days!`,
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      {/* Confetti-like particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute h-2 w-2 rounded-full animate-bounce"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              backgroundColor: ["#f59e0b", "#ef4444", "#22c55e", "#3b82f6", "#a855f7"][
                i % 5
              ],
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${1 + Math.random() * 2}s`,
              opacity: 0.8,
            }}
          />
        ))}
      </div>

      <div className="relative mx-4 w-full max-w-sm rounded-2xl border border-border bg-card p-6 shadow-2xl">
        <button
          onClick={handleDismiss}
          className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex flex-col items-center text-center">
          <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-amber-400/20">
            <Trophy className="h-10 w-10 text-amber-400" />
          </div>

          <h2 className="mb-1 text-2xl font-bold text-foreground">
            {info.title}
          </h2>
          <p className="mb-4 text-sm text-muted-foreground">{info.message}</p>

          <div className="mb-6 flex items-center gap-2 rounded-full bg-amber-400/10 px-4 py-2">
            <Flame className="h-5 w-5 text-amber-400" />
            <span className="text-lg font-bold text-amber-400">
              {currentMilestone} day streak
            </span>
          </div>

          <Button className="w-full" onClick={handleDismiss}>
            Keep Going!
          </Button>
        </div>
      </div>
    </div>
  );
}

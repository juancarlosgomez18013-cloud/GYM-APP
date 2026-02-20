import { useEffect, useState } from "react";
import { View, Text, Modal, Pressable, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants/theme";
import { useGamificationStore } from "@/stores/gamification-store";
import { useDailyLogStore } from "@/stores/daily-log-store";
import { Button } from "@/components/ui/Button";

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

const CONFETTI_COLORS = ["#fbbf24", "#ef4444", "#22c55e", "#3b82f6", "#a855f7"];
const { width: SCREEN_W } = Dimensions.get("window");

export function MilestoneCelebration() {
  const [visible, setVisible] = useState(false);
  const [milestone, setMilestone] = useState(0);
  const lastCelebrated = useGamificationStore((s) => s.lastCelebratedMilestone);
  const setLastCelebrated = useGamificationStore((s) => s.setLastCelebratedMilestone);
  const getCurrentStreak = useDailyLogStore((s) => s.getCurrentStreak);

  useEffect(() => {
    const streak = getCurrentStreak();
    const reached = [...MILESTONES].reverse().find((m) => streak >= m);
    if (reached && reached > lastCelebrated) {
      setMilestone(reached);
      setVisible(true);
    }
  }, [getCurrentStreak, lastCelebrated]);

  const dismiss = () => {
    setVisible(false);
    setLastCelebrated(milestone);
  };

  const info = MILESTONE_MESSAGES[milestone] ?? {
    title: `${milestone} Days!`,
    message: `You've tracked for ${milestone} consecutive days!`,
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View className="flex-1 items-center justify-center bg-black/60">
        {/* Confetti */}
        {Array.from({ length: 20 }).map((_, i) => (
          <View
            key={i}
            className="absolute w-2 h-2 rounded-full"
            style={{
              left: Math.random() * SCREEN_W,
              top: Math.random() * 600,
              backgroundColor: CONFETTI_COLORS[i % 5],
              opacity: 0.8,
            }}
          />
        ))}

        <View className="bg-card rounded-2xl border border-border p-6 mx-6 w-full max-w-sm items-center">
          <Pressable onPress={dismiss} className="absolute right-3 top-3">
            <Ionicons name="close" size={20} color={COLORS.mutedForeground} />
          </Pressable>

          <View className="w-20 h-20 rounded-full bg-amber-500/20 items-center justify-center mb-4">
            <Ionicons name="trophy" size={40} color={COLORS.amber400} />
          </View>

          <Text className="text-2xl font-bold text-foreground mb-1">{info.title}</Text>
          <Text className="text-sm text-muted-foreground text-center mb-4">{info.message}</Text>

          <View className="flex-row items-center gap-2 bg-amber-500/10 rounded-full px-4 py-2 mb-6">
            <Ionicons name="flame" size={20} color={COLORS.amber400} />
            <Text className="text-lg font-bold" style={{ color: COLORS.amber400 }}>
              {milestone} day streak
            </Text>
          </View>

          <Button onPress={dismiss} className="w-full">Keep Going!</Button>
        </View>
      </View>
    </Modal>
  );
}

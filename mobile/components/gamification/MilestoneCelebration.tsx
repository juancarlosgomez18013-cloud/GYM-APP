import { useEffect, useState, useMemo } from "react";
import { View, Text, Modal, Pressable, Dimensions } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSpring,
  withSequence,
  Easing,
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants/theme";
import { useGamificationStore } from "@/stores/gamification-store";
import { useDailyLogStore } from "@/stores/daily-log-store";
import { GradientButton } from "@/components/ui/GradientButton";

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

const CONFETTI_COLORS = ["#fbbf24", "#ef4444", "#22c55e", "#3b82f6", "#a855f7", "#ec4899", "#4ade80"];
const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get("window");

function ConfettiPiece({ index, visible }: { index: number; visible: boolean }) {
  const translateY = useSharedValue(-50);
  const translateX = useSharedValue(0);
  const rotate = useSharedValue(0);
  const opacity = useSharedValue(0);

  const startX = useMemo(() => Math.random() * SCREEN_W, []);
  const drift = useMemo(() => (Math.random() - 0.5) * 100, []);
  const size = useMemo(() => 6 + Math.random() * 6, []);
  const delay = useMemo(() => index * 60, [index]);
  const color = CONFETTI_COLORS[index % CONFETTI_COLORS.length];
  const isRound = index % 3 === 0;

  useEffect(() => {
    if (visible) {
      opacity.value = withDelay(delay, withTiming(1, { duration: 100 }));
      translateY.value = withDelay(
        delay,
        withTiming(SCREEN_H * 0.7, {
          duration: 2000 + Math.random() * 1000,
          easing: Easing.out(Easing.quad),
        })
      );
      translateX.value = withDelay(
        delay,
        withTiming(drift, { duration: 2000 })
      );
      rotate.value = withDelay(
        delay,
        withTiming(360 * (1 + Math.random() * 2), { duration: 2500 })
      );
      // Fade out near the end
      opacity.value = withDelay(
        delay + 1500,
        withTiming(0, { duration: 800 })
      );
    } else {
      translateY.value = -50;
      opacity.value = 0;
    }
  }, [visible]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { translateX: translateX.value },
      { rotate: `${rotate.value}deg` },
    ],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        animatedStyle,
        {
          position: "absolute",
          left: startX,
          top: -20,
          width: size,
          height: isRound ? size : size * 1.5,
          borderRadius: isRound ? size / 2 : 2,
          backgroundColor: color,
        },
      ]}
      pointerEvents="none"
    />
  );
}

export function MilestoneCelebration() {
  const [visible, setVisible] = useState(false);
  const [milestone, setMilestone] = useState(0);
  const lastCelebrated = useGamificationStore((s) => s.lastCelebratedMilestone);
  const setLastCelebrated = useGamificationStore((s) => s.setLastCelebratedMilestone);
  const getCurrentStreak = useDailyLogStore((s) => s.getCurrentStreak);

  const trophyScale = useSharedValue(0);
  const cardScale = useSharedValue(0.8);
  const cardOpacity = useSharedValue(0);

  useEffect(() => {
    const streak = getCurrentStreak();
    const reached = [...MILESTONES].reverse().find((m) => streak >= m);
    if (reached && reached > lastCelebrated) {
      setMilestone(reached);
      setVisible(true);
      // Animate card entrance
      cardScale.value = withSpring(1, { damping: 12, stiffness: 150 });
      cardOpacity.value = withTiming(1, { duration: 300 });
      // Bounce trophy
      trophyScale.value = withDelay(
        200,
        withSequence(
          withSpring(1.2, { damping: 8, stiffness: 200 }),
          withSpring(1, { damping: 10, stiffness: 150 })
        )
      );
    }
  }, [getCurrentStreak, lastCelebrated]);

  const dismiss = () => {
    setVisible(false);
    setLastCelebrated(milestone);
  };

  const trophyAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: trophyScale.value }],
  }));

  const cardAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: cardScale.value }],
    opacity: cardOpacity.value,
  }));

  const info = MILESTONE_MESSAGES[milestone] ?? {
    title: `${milestone} Days!`,
    message: `You've tracked for ${milestone} consecutive days!`,
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View className="flex-1 items-center justify-center bg-black/60">
        {/* Animated Confetti */}
        {Array.from({ length: 30 }).map((_, i) => (
          <ConfettiPiece key={i} index={i} visible={visible} />
        ))}

        <Animated.View
          style={cardAnimatedStyle}
          className="bg-card rounded-2xl border border-border p-6 mx-6 w-full max-w-sm items-center"
        >
          <Pressable onPress={dismiss} className="absolute right-3 top-3 z-10">
            <Ionicons name="close" size={20} color={COLORS.mutedForeground} />
          </Pressable>

          <Animated.View
            style={trophyAnimatedStyle}
            className="w-20 h-20 rounded-full bg-amber-500/20 items-center justify-center mb-4"
          >
            <Ionicons name="trophy" size={40} color={COLORS.amber400} />
          </Animated.View>

          <Text className="text-2xl font-bold text-foreground mb-1">{info.title}</Text>
          <Text className="text-sm text-muted-foreground text-center mb-4">{info.message}</Text>

          <View className="flex-row items-center gap-2 bg-amber-500/10 rounded-full px-4 py-2 mb-6">
            <Ionicons name="flame" size={20} color={COLORS.amber400} />
            <Text className="text-lg font-bold" style={{ color: COLORS.amber400 }}>
              {milestone} day streak
            </Text>
          </View>

          <GradientButton
            onPress={dismiss}
            className="w-full"
            colors={[COLORS.gradientGold, COLORS.gradientOrange]}
          >
            <Text className="text-sm font-bold text-primary-foreground">Keep Going!</Text>
          </GradientButton>
        </Animated.View>
      </View>
    </Modal>
  );
}

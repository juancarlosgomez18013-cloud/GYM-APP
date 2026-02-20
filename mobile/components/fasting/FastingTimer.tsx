import { useEffect, useState } from "react";
import { View, Text } from "react-native";
import Svg, { Circle } from "react-native-svg";
import { useFastingStore } from "@/stores/fasting-store";
import { COLORS } from "@/constants/theme";

interface FastingTimerProps {
  size?: number;
}

export function FastingTimer({ size = 200 }: FastingTimerProps) {
  const getTimeRemaining = useFastingStore((s) => s.getTimeRemaining);
  const currentSession = useFastingStore((s) => s.currentSession);
  const [timeData, setTimeData] = useState(getTimeRemaining());

  useEffect(() => {
    const iv = setInterval(() => setTimeData(getTimeRemaining()), 1000);
    return () => clearInterval(iv);
  }, [getTimeRemaining]);

  if (!currentSession || !timeData) {
    return (
      <View className="items-center justify-center" style={{ width: size, height: size }}>
        <Text className="text-lg font-medium text-muted-foreground">No active fast</Text>
        <Text className="text-sm text-muted-foreground mt-1" style={{ opacity: 0.7 }}>
          Start a fast to begin tracking
        </Text>
      </View>
    );
  }

  const { hours, minutes, seconds, phase, totalSeconds, totalPhaseDuration } = timeData;
  const elapsed = totalPhaseDuration - totalSeconds;
  const progress = totalPhaseDuration > 0 ? elapsed / totalPhaseDuration : 0;

  const center = size / 2;
  const strokeWidth = 8;
  const radius = center - strokeWidth;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - progress);
  const isFasting = phase === "fasting";
  const ringColor = isFasting ? COLORS.amber400 : COLORS.green400;
  const pad = (n: number) => n.toString().padStart(2, "0");

  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size} style={{ transform: [{ rotate: "-90deg" }] }}>
        <Circle cx={center} cy={center} r={radius} fill="none" stroke={COLORS.muted} strokeWidth={strokeWidth} opacity={0.3} />
        <Circle cx={center} cy={center} r={radius} fill="none" stroke={ringColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeDasharray={`${circumference}`} strokeDashoffset={dashOffset} />
      </Svg>
      <View className="absolute inset-0 items-center justify-center">
        <Text className="text-3xl font-bold" style={{ color: ringColor, fontVariant: ["tabular-nums"] }}>
          {pad(hours)}:{pad(minutes)}:{pad(seconds)}
        </Text>
        <Text className="text-xs font-medium uppercase tracking-wider text-muted-foreground mt-1">
          {isFasting ? "Fasting" : "Eating Window"}
        </Text>
        <Text className="text-xs text-muted-foreground" style={{ opacity: 0.7 }}>
          {isFasting ? "until eating window" : "until next fast"}
        </Text>
      </View>
    </View>
  );
}

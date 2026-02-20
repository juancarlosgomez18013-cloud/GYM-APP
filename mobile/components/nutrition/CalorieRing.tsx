import { useEffect, useState } from "react";
import { View, Text } from "react-native";
import Svg, { Circle } from "react-native-svg";
import { COLORS } from "@/constants/theme";

interface CalorieRingProps {
  consumed: number;
  target: number;
  size?: number;
}

export function CalorieRing({ consumed, target, size = 180 }: CalorieRingProps) {
  const [animatedProgress, setAnimatedProgress] = useState(0);

  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const rawPercent = target > 0 ? consumed / target : 0;
  const clampedPercent = Math.min(rawPercent, 1.2);
  const remaining = Math.max(target - consumed, 0);

  const getColor = (percent: number): string => {
    if (percent > 1) return "#ef4444";
    if (percent >= 0.8) return "#eab308";
    return COLORS.primary;
  };

  const strokeColor = getColor(rawPercent);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setAnimatedProgress(clampedPercent);
    }, 100);
    return () => clearTimeout(timeout);
  }, [clampedPercent]);

  const dashOffset = circumference * (1 - animatedProgress);

  return (
    <View className="items-center justify-center" style={{ width: size, height: size }}>
      <Svg width={size} height={size} style={{ transform: [{ rotate: "-90deg" }] }}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={COLORS.muted}
          strokeWidth={strokeWidth}
          opacity={0.4}
        />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={`${circumference}`}
          strokeDashoffset={dashOffset}
        />
      </Svg>

      <View className="absolute items-center justify-center">
        <Text className="text-3xl font-bold text-foreground">
          {remaining > 0 ? remaining.toLocaleString() : 0}
        </Text>
        <Text className="text-xs text-muted-foreground">remaining</Text>
        <View className="flex-row mt-1">
          <Text className="text-sm font-medium text-foreground">
            {Math.round(consumed).toLocaleString()}
          </Text>
          <Text className="text-sm text-muted-foreground">
            {" / "}
            {target.toLocaleString()} kcal
          </Text>
        </View>
      </View>
    </View>
  );
}

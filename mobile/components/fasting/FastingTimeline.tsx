import { View, Text } from "react-native";
import { COLORS } from "@/constants/theme";

interface FastingTimelineProps {
  fastingHours: number;
  eatingHours: number;
  elapsedHours: number;
  phase: "fasting" | "eating" | "idle";
}

export function FastingTimeline({ fastingHours, eatingHours, elapsedHours, phase }: FastingTimelineProps) {
  const totalHours = fastingHours + eatingHours;
  const fastingPercent = (fastingHours / totalHours) * 100;
  const currentPercent = Math.min((elapsedHours / totalHours) * 100, 100);

  return (
    <View className="w-full">
      <View className="flex-row justify-between mb-2">
        <Text className="text-xs text-muted-foreground">Start</Text>
        <Text className="text-xs text-muted-foreground">{fastingHours}h fasting</Text>
        <Text className="text-xs text-muted-foreground">{eatingHours}h eating</Text>
      </View>

      <View className="h-4 w-full rounded-full overflow-hidden" style={{ backgroundColor: `${COLORS.muted}40` }}>
        {/* Fasting bg */}
        <View className="absolute inset-y-0 left-0 rounded-l-full" style={{ width: `${fastingPercent}%`, backgroundColor: `${COLORS.amber400}30` }} />
        {/* Eating bg */}
        <View className="absolute inset-y-0 rounded-r-full" style={{ left: `${fastingPercent}%`, width: `${100 - fastingPercent}%`, backgroundColor: `${COLORS.green400}30` }} />
        {/* Progress fill */}
        {phase !== "idle" && (
          <View
            className="absolute inset-y-0 left-0 rounded-full"
            style={{
              width: `${currentPercent}%`,
              backgroundColor: currentPercent <= fastingPercent ? `${COLORS.amber400}60` : `${COLORS.green400}60`,
            }}
          />
        )}
        {/* Divider */}
        <View className="absolute inset-y-0 w-0.5" style={{ left: `${fastingPercent}%`, backgroundColor: COLORS.border }} />
        {/* Indicator */}
        {phase !== "idle" && (
          <View
            className="absolute top-1/2 h-5 w-1.5 rounded-full"
            style={{ left: `${currentPercent}%`, marginLeft: -3, marginTop: -10, backgroundColor: COLORS.foreground }}
          />
        )}
      </View>

      <View className="flex-row justify-between mt-1">
        <Text className="text-xs text-muted-foreground" style={{ opacity: 0.7 }}>0h</Text>
        <Text className="text-xs text-muted-foreground" style={{ opacity: 0.7 }}>{fastingHours}h</Text>
        <Text className="text-xs text-muted-foreground" style={{ opacity: 0.7 }}>{totalHours}h</Text>
      </View>
    </View>
  );
}

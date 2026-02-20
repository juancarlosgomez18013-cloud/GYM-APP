import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants/theme";

interface StreakBadgeProps {
  streak: number;
}

function getStreakTier(streak: number) {
  if (streak >= 30) return { color: COLORS.amber400, bg: "bg-amber-500/10" };
  if (streak >= 7) return { color: COLORS.orange400, bg: "bg-orange-500/10" };
  if (streak >= 1) return { color: COLORS.red400, bg: "bg-red-500/10" };
  return { color: COLORS.mutedForeground, bg: "bg-muted/30" };
}

export function StreakBadge({ streak }: StreakBadgeProps) {
  const tier = getStreakTier(streak);

  return (
    <View className={`flex-row items-center gap-1.5 rounded-full px-3 py-1.5 ${tier.bg}`}>
      <Ionicons name="flame" size={16} color={tier.color} />
      <Text style={{ color: tier.color }} className="text-sm font-semibold">
        {streak}
      </Text>
      <Text className="text-xs text-muted-foreground">
        {streak === 1 ? "day" : "days"}
      </Text>
    </View>
  );
}

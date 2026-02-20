import { View, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

interface MacroProgressBarProps {
  label: string;
  current: number;
  target: number;
  color: string;
}

function lighten(hex: string, amount: number): string {
  const r = Math.min(255, parseInt(hex.slice(1, 3), 16) + amount);
  const g = Math.min(255, parseInt(hex.slice(3, 5), 16) + amount);
  const b = Math.min(255, parseInt(hex.slice(5, 7), 16) + amount);
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}

export function MacroProgressBar({ label, current, target, color }: MacroProgressBarProps) {
  const percent = target > 0 ? Math.min((current / target) * 100, 100) : 0;

  return (
    <View>
      <View className="flex-row justify-between mb-1.5">
        <Text className="text-sm font-medium text-foreground">{label}</Text>
        <Text className="text-sm text-muted-foreground">
          {Math.round(current)}g / {target}g
        </Text>
      </View>
      <View className="h-2.5 rounded-full bg-muted/40 overflow-hidden">
        <View className="h-full rounded-full overflow-hidden" style={{ width: `${percent}%` }}>
          <LinearGradient
            colors={[color, lighten(color, 40)]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            className="flex-1"
          />
        </View>
      </View>
    </View>
  );
}

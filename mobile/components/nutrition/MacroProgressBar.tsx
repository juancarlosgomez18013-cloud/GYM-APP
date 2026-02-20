import { View, Text } from "react-native";

interface MacroProgressBarProps {
  label: string;
  current: number;
  target: number;
  color: string;
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
        <View
          className="h-full rounded-full"
          style={{ width: `${percent}%`, backgroundColor: color }}
        />
      </View>
    </View>
  );
}

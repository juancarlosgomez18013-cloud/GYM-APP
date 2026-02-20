import { View, Text, Pressable, TextInput } from "react-native";
import { FASTING_PROTOCOLS } from "@/types/fasting";
import type { FastingProtocol } from "@/types/fasting";
import { COLORS } from "@/constants/theme";

interface ProtocolSelectorProps {
  selected: FastingProtocol;
  onSelect: (p: FastingProtocol) => void;
  customFastingHours: number;
  customEatingHours: number;
  onCustomChange: (fasting: number, eating: number) => void;
}

export function ProtocolSelector({ selected, onSelect, customFastingHours, customEatingHours, onCustomChange }: ProtocolSelectorProps) {
  return (
    <View className="gap-2">
      {FASTING_PROTOCOLS.map((p) => (
        <Pressable
          key={p.id}
          onPress={() => onSelect(p.id)}
          className={`rounded-xl border px-4 py-3 ${selected === p.id ? "border-primary bg-primary/10" : "border-border"}`}
        >
          <View className="flex-row items-center justify-between">
            <Text className="text-sm font-semibold text-foreground">{p.label}</Text>
            <Text className="text-xs text-muted-foreground">{p.fastingHours}h / {p.eatingHours}h</Text>
          </View>
          <Text className="text-xs text-muted-foreground mt-1">{p.description}</Text>
        </Pressable>
      ))}

      {/* Custom */}
      <Pressable
        onPress={() => onSelect("custom")}
        className={`rounded-xl border px-4 py-3 ${selected === "custom" ? "border-primary bg-primary/10" : "border-border"}`}
      >
        <Text className="text-sm font-semibold text-foreground">Custom</Text>
        <Text className="text-xs text-muted-foreground mt-1">Set your own fasting and eating windows</Text>
        {selected === "custom" && (
          <View className="flex-row gap-4 mt-3">
            <View className="flex-1">
              <Text className="text-xs text-muted-foreground mb-1">Fasting (h)</Text>
              <TextInput
                value={String(customFastingHours)}
                onChangeText={(v) => onCustomChange(Number(v) || 0, customEatingHours)}
                keyboardType="numeric"
                className="bg-accent border border-border rounded-lg px-3 py-2 text-foreground text-sm"
                placeholderTextColor={COLORS.mutedForeground}
              />
            </View>
            <View className="flex-1">
              <Text className="text-xs text-muted-foreground mb-1">Eating (h)</Text>
              <TextInput
                value={String(customEatingHours)}
                onChangeText={(v) => onCustomChange(customFastingHours, Number(v) || 0)}
                keyboardType="numeric"
                className="bg-accent border border-border rounded-lg px-3 py-2 text-foreground text-sm"
                placeholderTextColor={COLORS.mutedForeground}
              />
            </View>
          </View>
        )}
      </Pressable>
    </View>
  );
}

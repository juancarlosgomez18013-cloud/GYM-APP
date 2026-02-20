import { View, Text } from "react-native";
import { BlurView } from "expo-blur";
import type { PropsWithChildren } from "react";
import { COLORS } from "@/constants/theme";

interface CardProps extends PropsWithChildren {
  className?: string;
  glass?: boolean;
}

export function Card({ children, className = "", glass = true }: CardProps) {
  if (glass) {
    return (
      <View
        className={`rounded-2xl overflow-hidden ${className}`}
        style={{
          borderWidth: 1,
          borderColor: COLORS.glassBorder,
        }}
      >
        <BlurView intensity={40} tint="dark" className="p-4">
          <View
            className="absolute inset-0"
            style={{ backgroundColor: COLORS.glassBackground }}
          />
          {children}
        </BlurView>
      </View>
    );
  }

  return (
    <View className={`bg-card rounded-2xl border border-border p-4 ${className}`}>
      {children}
    </View>
  );
}

export function CardHeader({ children, className = "" }: CardProps) {
  return <View className={`mb-3 ${className}`}>{children}</View>;
}

export function CardTitle({ children, className = "" }: CardProps) {
  return (
    <Text className={`text-base font-semibold text-foreground ${className}`}>
      {children}
    </Text>
  );
}

export function CardContent({ children, className = "" }: CardProps) {
  return <View className={className}>{children}</View>;
}

import { View, Text } from "react-native";
import type { PropsWithChildren } from "react";

interface CardProps extends PropsWithChildren {
  className?: string;
}

export function Card({ children, className = "" }: CardProps) {
  return (
    <View className={`bg-card rounded-xl border border-border p-4 ${className}`}>
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

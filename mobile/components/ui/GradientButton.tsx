import { Pressable, Text, ActivityIndicator, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import type { PropsWithChildren } from "react";
import { COLORS } from "@/constants/theme";

interface GradientButtonProps extends PropsWithChildren {
  onPress?: () => void;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  icon?: React.ReactNode;
  colors?: readonly [string, string, ...string[]];
}

export function GradientButton({
  children,
  onPress,
  disabled,
  loading,
  className = "",
  icon,
  colors,
}: GradientButtonProps) {
  const gradientColors = colors ?? [COLORS.gradientStart, COLORS.gradientEnd] as [string, string];

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      className={`rounded-xl overflow-hidden ${disabled ? "opacity-50" : "active:opacity-80"} ${className}`}
    >
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        className="flex-row items-center justify-center px-4 py-3"
      >
        {loading ? (
          <ActivityIndicator color={COLORS.primaryForeground} />
        ) : (
          <>
            {icon && <View className="mr-2">{icon}</View>}
            {typeof children === "string" ? (
              <Text className="text-sm font-bold text-primary-foreground">
                {children}
              </Text>
            ) : (
              children
            )}
          </>
        )}
      </LinearGradient>
    </Pressable>
  );
}

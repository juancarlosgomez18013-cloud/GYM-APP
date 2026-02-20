import { Pressable, Text, ActivityIndicator, View } from "react-native";
import type { PropsWithChildren } from "react";

type ButtonVariant = "default" | "outline" | "ghost" | "destructive";

interface ButtonProps extends PropsWithChildren {
  variant?: ButtonVariant;
  onPress?: () => void;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  icon?: React.ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  default: "bg-primary",
  outline: "border border-border bg-transparent",
  ghost: "bg-transparent",
  destructive: "bg-destructive",
};

const textStyles: Record<ButtonVariant, string> = {
  default: "text-primary-foreground font-semibold",
  outline: "text-foreground",
  ghost: "text-foreground",
  destructive: "text-white font-semibold",
};

export function Button({
  children,
  variant = "default",
  onPress,
  disabled,
  loading,
  className = "",
  icon,
}: ButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      className={`flex-row items-center justify-center rounded-xl px-4 py-3 ${variantStyles[variant]} ${
        disabled ? "opacity-50" : "active:opacity-80"
      } ${className}`}
    >
      {loading ? (
        <ActivityIndicator color={variant === "default" ? "#0a1a0f" : "#4ade80"} />
      ) : (
        <>
          {icon && <View className="mr-2">{icon}</View>}
          {typeof children === "string" ? (
            <Text className={`text-sm ${textStyles[variant]}`}>{children}</Text>
          ) : (
            children
          )}
        </>
      )}
    </Pressable>
  );
}

import { View, Text } from "react-native";

interface BadgeProps {
  children: string;
  variant?: "default" | "secondary" | "outline";
  className?: string;
}

const variantStyles = {
  default: "bg-primary",
  secondary: "bg-muted",
  outline: "border border-border bg-transparent",
};

const textVariant = {
  default: "text-primary-foreground",
  secondary: "text-muted-foreground",
  outline: "text-foreground",
};

export function Badge({ children, variant = "default", className = "" }: BadgeProps) {
  return (
    <View className={`rounded-full px-2.5 py-1 ${variantStyles[variant]} ${className}`}>
      <Text className={`text-xs font-medium ${textVariant[variant]}`}>{children}</Text>
    </View>
  );
}

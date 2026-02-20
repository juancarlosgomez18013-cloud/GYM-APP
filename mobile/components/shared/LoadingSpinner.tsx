import { View, Text, ActivityIndicator } from "react-native";

interface LoadingSpinnerProps {
  label?: string;
  className?: string;
}

export function LoadingSpinner({ label, className = "" }: LoadingSpinnerProps) {
  return (
    <View className={`items-center justify-center py-8 ${className}`}>
      <ActivityIndicator size="large" color="#4ade80" />
      {label && <Text className="text-sm text-muted-foreground mt-3">{label}</Text>}
    </View>
  );
}

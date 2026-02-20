import { TextInput as RNTextInput, View, Text } from "react-native";
import type { TextInputProps } from "react-native";

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
}

export function Input({ label, error, className = "", ...props }: InputProps) {
  return (
    <View>
      {label && <Text className="text-sm font-medium text-foreground mb-1.5">{label}</Text>}
      <RNTextInput
        className={`bg-accent border border-border rounded-xl px-4 py-3 text-foreground text-sm ${
          error ? "border-destructive" : ""
        } ${className}`}
        placeholderTextColor="#9ca3af"
        {...props}
      />
      {error && <Text className="text-xs text-destructive mt-1">{error}</Text>}
    </View>
  );
}

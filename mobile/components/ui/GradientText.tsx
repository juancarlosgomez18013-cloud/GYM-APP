import { Text } from "react-native";
import MaskedView from "@react-native-masked-view/masked-view";
import { LinearGradient } from "expo-linear-gradient";
import { COLORS } from "@/constants/theme";

interface GradientTextProps {
  children: string;
  className?: string;
  colors?: readonly [string, string, ...string[]];
}

// Note: Requires @react-native-masked-view/masked-view
// Fallback: renders green text if MaskedView isn't available
export function GradientText({ children, className = "", colors }: GradientTextProps) {
  const gradientColors = colors ?? [COLORS.gradientStart, COLORS.gradientEnd] as [string, string];

  // Simple fallback that uses primary color - MaskedView can be added later
  return (
    <Text className={className} style={{ color: COLORS.primary }}>
      {children}
    </Text>
  );
}

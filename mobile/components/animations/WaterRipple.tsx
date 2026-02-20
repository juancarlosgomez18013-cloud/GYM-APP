import { useEffect } from "react";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  Easing,
  runOnJS,
} from "react-native-reanimated";

interface WaterRippleProps {
  trigger: number; // changes when a glass is added
  size?: number;
}

export function WaterRipple({ trigger, size = 60 }: WaterRippleProps) {
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (trigger > 0) {
      scale.value = 0;
      opacity.value = 0.5;
      scale.value = withTiming(1.5, {
        duration: 500,
        easing: Easing.out(Easing.cubic),
      });
      opacity.value = withTiming(0, {
        duration: 500,
        easing: Easing.out(Easing.cubic),
      });
    }
  }, [trigger]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
    position: "absolute" as const,
    width: size,
    height: size,
    borderRadius: size / 2,
    borderWidth: 2,
    borderColor: "#60a5fa",
    alignSelf: "center" as const,
  }));

  return <Animated.View style={animatedStyle} pointerEvents="none" />;
}

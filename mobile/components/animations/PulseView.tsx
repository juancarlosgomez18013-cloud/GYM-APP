import { useEffect } from "react";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from "react-native-reanimated";
import type { PropsWithChildren } from "react";

interface PulseViewProps extends PropsWithChildren {
  active?: boolean;
  intensity?: number;
  duration?: number;
  className?: string;
}

export function PulseView({
  children,
  active = true,
  intensity = 0.06,
  duration = 1500,
  className = "",
}: PulseViewProps) {
  const scale = useSharedValue(1);

  useEffect(() => {
    if (active) {
      scale.value = withRepeat(
        withSequence(
          withTiming(1 + intensity, {
            duration: duration / 2,
            easing: Easing.inOut(Easing.ease),
          }),
          withTiming(1, {
            duration: duration / 2,
            easing: Easing.inOut(Easing.ease),
          })
        ),
        -1, // infinite
        false
      );
    } else {
      scale.value = withTiming(1, { duration: 200 });
    }
  }, [active, intensity, duration]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View className={className} style={animatedStyle}>
      {children}
    </Animated.View>
  );
}

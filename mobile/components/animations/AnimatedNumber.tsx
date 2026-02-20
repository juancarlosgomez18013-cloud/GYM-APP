import { useEffect } from "react";
import { Text } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
  Easing,
} from "react-native-reanimated";

const AnimatedText = Animated.createAnimatedComponent(Text);

interface AnimatedNumberProps {
  value: number;
  duration?: number;
  className?: string;
  style?: any;
  suffix?: string;
  formatter?: (n: number) => string;
}

export function AnimatedNumber({
  value,
  duration = 600,
  className = "",
  style,
  suffix = "",
  formatter,
}: AnimatedNumberProps) {
  const animatedValue = useSharedValue(0);

  useEffect(() => {
    animatedValue.value = withTiming(value, {
      duration,
      easing: Easing.out(Easing.cubic),
    });
  }, [value, duration]);

  const animatedProps = useAnimatedProps(() => {
    const current = Math.round(animatedValue.value);
    const text = formatter ? formatter(current) : current.toLocaleString();
    return {
      text: `${text}${suffix}`,
    } as any;
  });

  return (
    <AnimatedText
      className={className}
      style={style}
      animatedProps={animatedProps}
    >
      {formatter ? formatter(value) : value.toLocaleString()}{suffix}
    </AnimatedText>
  );
}

import { View, Text } from "react-native";
import Svg, { Path } from "react-native-svg";
import { COLORS } from "@/constants/theme";

interface MacroDonutChartProps {
  protein: number;
  carbs: number;
  fat: number;
  calories: number;
  size?: number;
}

function describeArc(cx: number, cy: number, r: number, startAngle: number, endAngle: number): string {
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`;
}

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const angleRad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(angleRad), y: cy + r * Math.sin(angleRad) };
}

export function MacroDonutChart({ protein, carbs, fat, calories, size = 160 }: MacroDonutChartProps) {
  const total = protein + carbs + fat;
  const cx = size / 2;
  const cy = size / 2;
  const outerR = size / 2 - 10;
  const strokeW = 22;
  const r = outerR - strokeW / 2;

  const data = [
    { value: protein, color: COLORS.macroProtein, label: "Protein" },
    { value: carbs, color: COLORS.macroCarbs, label: "Carbs" },
    { value: fat, color: COLORS.macroFat, label: "Fat" },
  ];

  let currentAngle = 0;
  const arcs = total > 0
    ? data.map((d) => {
        const sweep = (d.value / total) * 360 - 2;
        const startAngle = currentAngle + 1;
        const endAngle = currentAngle + sweep + 1;
        currentAngle += (d.value / total) * 360;
        return { ...d, startAngle, endAngle };
      })
    : [];

  return (
    <View className="items-center">
      <View style={{ width: size, height: size }}>
        <Svg width={size} height={size}>
          {total === 0 ? (
            <Path
              d={describeArc(cx, cy, r, 0, 359.9)}
              fill="none"
              stroke={COLORS.muted}
              strokeWidth={strokeW}
              strokeLinecap="round"
              opacity={0.4}
            />
          ) : (
            arcs.map((arc, i) => (
              <Path
                key={i}
                d={describeArc(cx, cy, r, arc.startAngle, arc.endAngle)}
                fill="none"
                stroke={arc.color}
                strokeWidth={strokeW}
                strokeLinecap="round"
              />
            ))
          )}
        </Svg>
        <View className="absolute inset-0 items-center justify-center">
          <Text className="text-2xl font-bold text-foreground">{Math.round(calories)}</Text>
          <Text className="text-xs text-muted-foreground">kcal</Text>
        </View>
      </View>

      {total > 0 && (
        <View className="flex-row gap-4 mt-2">
          {data.map((d) => (
            <View key={d.label} className="flex-row items-center gap-1.5">
              <View className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
              <Text className="text-xs text-muted-foreground">{d.label}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";

interface MacroDonutChartProps {
  protein: number;
  carbs: number;
  fat: number;
  calories: number;
}

const COLORS = {
  protein: "#3b82f6",
  carbs: "#eab308",
  fat: "#f43f5e",
};

export function MacroDonutChart({
  protein,
  carbs,
  fat,
  calories,
}: MacroDonutChartProps) {
  const data = [
    { name: "Protein", value: protein, color: COLORS.protein },
    { name: "Carbs", value: carbs, color: COLORS.carbs },
    { name: "Fat", value: fat, color: COLORS.fat },
  ];

  const totalGrams = protein + carbs + fat;

  // If nothing logged yet, show a placeholder ring
  const chartData =
    totalGrams === 0
      ? [{ name: "Empty", value: 1, color: "hsl(0, 0%, 25%)" }]
      : data;

  return (
    <div className="relative h-[180px] w-[180px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={80}
            paddingAngle={totalGrams > 0 ? 3 : 0}
            dataKey="value"
            strokeWidth={0}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>

      {/* Center label */}
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold text-foreground">
          {Math.round(calories)}
        </span>
        <span className="text-xs text-muted-foreground">kcal</span>
      </div>

      {/* Legend */}
      {totalGrams > 0 && (
        <div className="mt-2 flex items-center justify-center gap-3">
          {data.map((item) => (
            <div key={item.name} className="flex items-center gap-1">
              <div
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-[11px] text-muted-foreground">
                {item.name}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

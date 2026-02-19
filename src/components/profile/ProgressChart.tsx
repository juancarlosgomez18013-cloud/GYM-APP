"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format, parseISO } from "date-fns";

interface ProgressChartProps {
  weightLog: Array<{ date: string; weightKg: number }>;
}

export function ProgressChart({ weightLog }: ProgressChartProps) {
  const sortedLog = [...weightLog].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const chartData = sortedLog.map((entry) => ({
    date: entry.date,
    weight: Number(entry.weightKg.toFixed(1)),
    label: format(parseISO(entry.date), "MMM d"),
  }));

  if (chartData.length === 0) {
    return (
      <Card className="border-border/50 bg-card/80">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Weight Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex h-[200px] items-center justify-center text-sm text-muted-foreground">
            No weight entries yet. Log your weight to see progress.
          </div>
        </CardContent>
      </Card>
    );
  }

  const weights = chartData.map((d) => d.weight);
  const minWeight = Math.floor(Math.min(...weights) - 2);
  const maxWeight = Math.ceil(Math.max(...weights) + 2);

  return (
    <Card className="border-border/50 bg-card/80">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">Weight Progress</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 5, right: 10, left: -10, bottom: 5 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="hsl(150 10% 20%)"
                vertical={false}
              />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 10, fill: "hsl(150 10% 55%)" }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                domain={[minWeight, maxWeight]}
                tick={{ fontSize: 10, fill: "hsl(150 10% 55%)" }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(val: number) => `${val}kg`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(150 7% 12%)",
                  border: "1px solid hsl(150 5% 25%)",
                  borderRadius: "8px",
                  fontSize: "12px",
                  color: "hsl(150 5% 90%)",
                }}
                labelFormatter={(label) => String(label)}
                formatter={(value) => [
                  `${value ?? 0} kg`,
                  "Weight",
                ]}
              />
              <Line
                type="monotone"
                dataKey="weight"
                stroke="hsl(150 70% 50%)"
                strokeWidth={2}
                dot={{
                  r: 4,
                  fill: "hsl(150 70% 50%)",
                  stroke: "hsl(150 7% 12%)",
                  strokeWidth: 2,
                }}
                activeDot={{
                  r: 6,
                  fill: "hsl(150 70% 60%)",
                  stroke: "hsl(150 7% 12%)",
                  strokeWidth: 2,
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

import { useMemo, useState, useEffect } from "react";
import { View, Text, Pressable, Modal } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useUserStore } from "@/stores/user-store";
import { useDailyLogStore } from "@/stores/daily-log-store";
import { useFastingStore } from "@/stores/fasting-store";
import { PageContainer } from "@/components/layout/PageContainer";
import { CalorieRing } from "@/components/nutrition/CalorieRing";
import { MacroProgressBar } from "@/components/nutrition/MacroProgressBar";
import { MacroDonutChart } from "@/components/nutrition/MacroDonutChart";
import { MealList } from "@/components/meals/MealList";
import { StreakBadge } from "@/components/gamification/StreakBadge";
import { MilestoneCelebration } from "@/components/gamification/MilestoneCelebration";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { COLORS, WATER_GOAL_ML, WATER_STEP_ML } from "@/constants/theme";
import type { UserProfile, ActivityLevel, FitnessGoal } from "@/types/user";

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

function formatDate(): string {
  return new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
}

function getTodayStr(): string {
  return new Date().toISOString().split("T")[0];
}

function calculateTargets(p: UserProfile) {
  const bmr = p.sex === "male"
    ? 10 * p.weightKg + 6.25 * p.heightCm - 5 * p.age + 5
    : 10 * p.weightKg + 6.25 * p.heightCm - 5 * p.age - 161;
  const mult: Record<ActivityLevel, number> = { sedentary: 1.2, lightly_active: 1.375, moderately_active: 1.55, active: 1.725, very_active: 1.9 };
  const tdee = bmr * (mult[p.activityLevel] ?? 1.55);
  const adj: Record<FitnessGoal, number> = { weight_loss: -400, muscle_gain: 400, recomposition: -250, maintenance: 0 };
  const cal = Math.round(tdee + (adj[p.goal] ?? 0));
  const sp: Record<FitnessGoal, { p: number; c: number; f: number }> = {
    weight_loss: { p: 0.4, c: 0.3, f: 0.3 }, muscle_gain: { p: 0.3, c: 0.45, f: 0.25 },
    recomposition: { p: 0.35, c: 0.35, f: 0.3 }, maintenance: { p: 0.3, c: 0.4, f: 0.3 },
  };
  const s = sp[p.goal] ?? sp.maintenance;
  return { calories: cal, protein: Math.round((cal * s.p) / 4), carbs: Math.round((cal * s.c) / 4), fat: Math.round((cal * s.f) / 9) };
}

export default function DashboardScreen() {
  const router = useRouter();
  const profile = useUserStore((s) => s.profile);
  const todayLog = useDailyLogStore((s) => s.getTodayLog());
  const removeMealEntry = useDailyLogStore((s) => s.removeMealEntry);
  const updateWaterIntake = useDailyLogStore((s) => s.updateWaterIntake);
  const getCurrentStreak = useDailyLogStore((s) => s.getCurrentStreak);
  const currentSession = useFastingStore((s) => s.currentSession);
  const getTimeRemaining = useFastingStore((s) => s.getTimeRemaining);

  const [quickAddOpen, setQuickAddOpen] = useState(false);
  const [streak, setStreak] = useState(0);
  const [fastingTime, setFastingTime] = useState(getTimeRemaining());

  useEffect(() => { setStreak(getCurrentStreak()); }, [getCurrentStreak, todayLog]);
  useEffect(() => {
    if (!currentSession) { setFastingTime(null); return; }
    const iv = setInterval(() => setFastingTime(getTimeRemaining()), 1000);
    return () => clearInterval(iv);
  }, [currentSession, getTimeRemaining]);

  const targets = useMemo(() => profile ? calculateTargets(profile) : null, [profile]);

  if (!profile || !targets) {
    return <PageContainer><LoadingSpinner className="mt-32" label="Loading your profile..." /></PageContainer>;
  }

  const today = getTodayStr();
  const meals = todayLog?.meals ?? [];
  const totals = todayLog?.totals ?? { calories: 0, protein: 0, carbohydrates: 0, fat: 0 };
  const waterMl = todayLog?.waterIntakeMl ?? 0;
  const waterGlasses = Math.floor(waterMl / WATER_STEP_ML);
  const waterPercent = Math.min((waterMl / WATER_GOAL_ML) * 100, 100);
  const pad = (n: number) => n.toString().padStart(2, "0");

  return (
    <PageContainer>
      <MilestoneCelebration />

      {/* Greeting */}
      <View className="mb-6">
        <View className="flex-row items-center justify-between">
          <Text className="text-2xl font-bold text-foreground">
            {getGreeting()}, {profile.name.split(" ")[0]}
          </Text>
          <StreakBadge streak={streak} />
        </View>
        <View className="flex-row items-center gap-2 mt-1">
          <Ionicons name="calendar-outline" size={16} color={COLORS.mutedForeground} />
          <Text className="text-sm text-muted-foreground">{formatDate()}</Text>
        </View>
        <Badge variant="secondary" className="mt-2 self-start">
          {profile.goal.replace("_", " ")}
        </Badge>
      </View>

      {/* Fasting Status */}
      <Pressable onPress={() => router.push("/(tabs)/fasting")}>
        <Card className="mb-4">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-3">
              <View className="w-10 h-10 rounded-full items-center justify-center" style={{ backgroundColor: currentSession ? "rgba(251,191,36,0.1)" : "rgba(42,61,48,0.4)" }}>
                <Ionicons name="timer-outline" size={20} color={currentSession ? COLORS.amber400 : COLORS.mutedForeground} />
              </View>
              <View>
                <Text className="text-sm font-medium text-foreground">
                  {currentSession && fastingTime ? (fastingTime.phase === "fasting" ? "Fasting" : "Eating Window") : "Intermittent Fasting"}
                </Text>
                <Text className="text-xs text-muted-foreground">
                  {currentSession ? `${currentSession.protocol} protocol` : "Tap to start a fast"}
                </Text>
              </View>
            </View>
            {currentSession && fastingTime ? (
              <View className="items-end">
                <Text className="text-lg font-bold tabular-nums" style={{ color: COLORS.amber400 }}>
                  {pad(fastingTime.hours)}:{pad(fastingTime.minutes)}:{pad(fastingTime.seconds)}
                </Text>
                <Text className="text-xs text-muted-foreground">remaining</Text>
              </View>
            ) : (
              <Badge variant="outline">Start</Badge>
            )}
          </View>
        </Card>
      </Pressable>

      {/* Calorie Ring + Donut */}
      <Card className="mb-4">
        <CardHeader><CardTitle>Daily Calories</CardTitle></CardHeader>
        <CardContent>
          <View className="flex-row flex-wrap items-center justify-center gap-4">
            <CalorieRing consumed={Math.round(totals.calories)} target={targets.calories} />
            <MacroDonutChart protein={Math.round(totals.protein)} carbs={Math.round(totals.carbohydrates)} fat={Math.round(totals.fat)} calories={Math.round(totals.calories)} />
          </View>
        </CardContent>
      </Card>

      {/* Macros */}
      <Card className="mb-4">
        <CardHeader><CardTitle>Macronutrients</CardTitle></CardHeader>
        <CardContent className="gap-4">
          <MacroProgressBar label="Protein" current={totals.protein} target={targets.protein} color={COLORS.macroProtein} />
          <MacroProgressBar label="Carbs" current={totals.carbohydrates} target={targets.carbs} color={COLORS.macroCarbs} />
          <MacroProgressBar label="Fat" current={totals.fat} target={targets.fat} color={COLORS.macroFat} />
        </CardContent>
      </Card>

      {/* Water */}
      <Card className="mb-4">
        <CardHeader>
          <View className="flex-row items-center gap-2">
            <Ionicons name="water" size={20} color="#60a5fa" />
            <CardTitle>Water Intake</CardTitle>
          </View>
        </CardHeader>
        <CardContent>
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-lg font-semibold text-foreground">
                {(waterMl / 1000).toFixed(1)}L
                <Text className="text-sm font-normal text-muted-foreground"> / {(WATER_GOAL_ML / 1000).toFixed(1)}L</Text>
              </Text>
              <Text className="text-xs text-muted-foreground">
                {waterGlasses} {waterGlasses === 1 ? "glass" : "glasses"} ({WATER_STEP_ML}ml each)
              </Text>
            </View>
            <View className="flex-row items-center gap-2">
              <Pressable
                onPress={() => waterMl >= WATER_STEP_ML && updateWaterIntake(today, waterMl - WATER_STEP_ML)}
                className="w-9 h-9 rounded-lg border border-border items-center justify-center active:opacity-60"
              >
                <Ionicons name="remove" size={18} color={COLORS.foreground} />
              </Pressable>
              <Pressable
                onPress={() => updateWaterIntake(today, waterMl + WATER_STEP_ML)}
                className="w-9 h-9 rounded-lg border border-border items-center justify-center active:opacity-60"
              >
                <Ionicons name="add" size={18} color={COLORS.foreground} />
              </Pressable>
            </View>
          </View>
          <View className="mt-3 h-2.5 rounded-full bg-muted/40 overflow-hidden">
            <View className="h-full rounded-full bg-blue-400" style={{ width: `${waterPercent}%` }} />
          </View>
        </CardContent>
      </Card>

      {/* Meals */}
      <View className="mb-4">
        <View className="flex-row items-center justify-between mb-3">
          <Text className="text-lg font-semibold text-foreground">Today's Meals</Text>
          {meals.length > 0 && <Text className="text-sm text-muted-foreground">{meals.length} {meals.length === 1 ? "item" : "items"}</Text>}
        </View>
        <MealList meals={meals} onDeleteMeal={(id) => removeMealEntry(today, id)} />
      </View>

      {/* FAB */}
      <Pressable
        onPress={() => setQuickAddOpen(true)}
        className="absolute bottom-6 right-4 w-14 h-14 rounded-full bg-primary items-center justify-center shadow-lg active:opacity-80"
        style={{ elevation: 8 }}
      >
        <Ionicons name="add" size={28} color={COLORS.primaryForeground} />
      </Pressable>

      {/* Quick Add Modal */}
      <Modal visible={quickAddOpen} transparent animationType="slide">
        <Pressable className="flex-1 bg-black/40" onPress={() => setQuickAddOpen(false)} />
        <View className="bg-card rounded-t-2xl px-4 pt-4 pb-10 border-t border-border">
          <Text className="text-lg font-semibold text-foreground mb-4">Add Food</Text>
          {[
            { icon: "camera" as const, title: "Scan Plate", desc: "AI estimates calories from a photo", route: "/(tabs)/scan" },
            { icon: "search" as const, title: "Search Food", desc: "Find in database or custom foods", route: "/food-search" },
            { icon: "add-circle-outline" as const, title: "Add Custom", desc: "Enter nutrition info manually", route: "/food-search/add" },
          ].map((item) => (
            <Pressable
              key={item.title}
              className="flex-row items-center gap-3 py-3 border border-border rounded-xl px-3 mb-2 active:opacity-70"
              onPress={() => { setQuickAddOpen(false); router.push(item.route as any); }}
            >
              <View className="w-10 h-10 rounded-full bg-primary/10 items-center justify-center">
                <Ionicons name={item.icon} size={20} color={COLORS.primary} />
              </View>
              <View>
                <Text className="text-sm font-medium text-foreground">{item.title}</Text>
                <Text className="text-xs text-muted-foreground">{item.desc}</Text>
              </View>
            </Pressable>
          ))}
        </View>
      </Modal>
    </PageContainer>
  );
}

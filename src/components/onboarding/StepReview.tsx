"use client";

import {
  User,
  Target,
  UtensilsCrossed,
  Flame,
  Calculator,
} from "lucide-react";
import type { OnboardingForm } from "./OnboardingWizard";

interface StepReviewProps {
  form: OnboardingForm;
}

const activityMultipliers: Record<string, number> = {
  sedentary: 1.2,
  lightly_active: 1.375,
  moderately_active: 1.55,
  active: 1.725,
  very_active: 1.9,
};

const goalAdjustments: Record<string, number> = {
  weight_loss: -400,
  muscle_gain: 400,
  recomposition: -250,
  maintenance: 0,
};

const goalLabels: Record<string, string> = {
  weight_loss: "Weight Loss",
  muscle_gain: "Muscle Gain",
  recomposition: "Recomposition",
  maintenance: "Maintenance",
};

const activityLabels: Record<string, string> = {
  sedentary: "Sedentary",
  lightly_active: "Lightly Active",
  moderately_active: "Moderately Active",
  active: "Active",
  very_active: "Very Active",
};

const dietLabels: Record<string, string> = {
  balanced: "Balanced",
  high_protein: "High Protein",
  keto: "Keto",
  mediterranean: "Mediterranean",
  iifym: "IIFYM",
};

function getMacroSplit(
  dietType: string,
  calories: number
): { protein: number; carbs: number; fat: number } {
  const splits: Record<
    string,
    { protein: number; carbs: number; fat: number }
  > = {
    balanced: { protein: 0.3, carbs: 0.4, fat: 0.3 },
    high_protein: { protein: 0.4, carbs: 0.3, fat: 0.3 },
    keto: { protein: 0.25, carbs: 0.05, fat: 0.7 },
    mediterranean: { protein: 0.25, carbs: 0.45, fat: 0.3 },
    iifym: { protein: 0.3, carbs: 0.4, fat: 0.3 },
  };

  const split = splits[dietType] || splits.balanced;

  return {
    protein: Math.round((calories * split.protein) / 4),
    carbs: Math.round((calories * split.carbs) / 4),
    fat: Math.round((calories * split.fat) / 9),
  };
}

export function StepReview({ form }: StepReviewProps) {
  const data = form.watch();

  const {
    sex,
    age,
    heightCm,
    weightKg,
    goal,
    activityLevel,
    dietType,
    name,
    country,
  } = data;

  // Calculate BMR using Mifflin-St Jeor
  const bmr =
    sex === "male"
      ? 10 * (weightKg || 0) + 6.25 * (heightCm || 0) - 5 * (age || 0) + 5
      : 10 * (weightKg || 0) + 6.25 * (heightCm || 0) - 5 * (age || 0) - 161;

  const tdee = Math.round(
    bmr * (activityMultipliers[activityLevel] || 1.2)
  );
  const goalAdj = goalAdjustments[goal] || 0;
  const dailyCalories = Math.round(tdee + goalAdj);
  const macros = getMacroSplit(dietType, dailyCalories);

  const totalMacroGrams = macros.protein + macros.carbs + macros.fat;
  const proteinPct =
    totalMacroGrams > 0
      ? Math.round((macros.protein / totalMacroGrams) * 100)
      : 0;
  const carbsPct =
    totalMacroGrams > 0
      ? Math.round((macros.carbs / totalMacroGrams) * 100)
      : 0;
  const fatPct = totalMacroGrams > 0 ? 100 - proteinPct - carbsPct : 0;

  return (
    <div className="space-y-5">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-3">
          <Calculator className="w-6 h-6 text-primary" />
        </div>
        <h2 className="text-xl font-bold text-foreground">Review Your Plan</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Confirm your details and see your personalized targets
        </p>
      </div>

      {/* Profile Summary */}
      <div className="rounded-xl border border-border bg-card p-4 space-y-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-foreground mb-2">
          <User className="w-4 h-4 text-primary" />
          Profile Summary
        </div>
        <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-sm">
          <div className="text-muted-foreground">Name</div>
          <div className="text-foreground font-medium">{name || "---"}</div>
          <div className="text-muted-foreground">Sex / Age</div>
          <div className="text-foreground font-medium capitalize">
            {sex || "---"} / {age || "---"} yrs
          </div>
          <div className="text-muted-foreground">Height</div>
          <div className="text-foreground font-medium">
            {heightCm ? `${heightCm} cm` : "---"}
          </div>
          <div className="text-muted-foreground">Weight</div>
          <div className="text-foreground font-medium">
            {weightKg ? `${weightKg} kg` : "---"}
          </div>
        </div>
      </div>

      {/* Goals & Activity */}
      <div className="rounded-xl border border-border bg-card p-4 space-y-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-foreground mb-2">
          <Target className="w-4 h-4 text-primary" />
          Goals & Activity
        </div>
        <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-sm">
          <div className="text-muted-foreground">Goal</div>
          <div className="text-foreground font-medium">
            {goalLabels[goal] || "---"}
          </div>
          <div className="text-muted-foreground">Activity</div>
          <div className="text-foreground font-medium">
            {activityLabels[activityLevel] || "---"}
          </div>
          <div className="text-muted-foreground">Country</div>
          <div className="text-foreground font-medium capitalize">
            {country || "---"}
          </div>
          <div className="text-muted-foreground">Diet Type</div>
          <div className="text-foreground font-medium">
            {dietLabels[dietType] || "---"}
          </div>
        </div>
      </div>

      {/* Calorie Calculation */}
      <div className="rounded-xl border border-primary/30 bg-primary/5 p-4 space-y-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-primary mb-1">
          <Flame className="w-4 h-4" />
          Your Daily Targets
        </div>

        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="rounded-lg bg-card/60 p-3 border border-border">
            <p className="text-xs text-muted-foreground">BMR</p>
            <p className="text-lg font-bold text-foreground">
              {Math.round(bmr)}
            </p>
            <p className="text-[10px] text-muted-foreground">kcal</p>
          </div>
          <div className="rounded-lg bg-card/60 p-3 border border-border">
            <p className="text-xs text-muted-foreground">TDEE</p>
            <p className="text-lg font-bold text-foreground">{tdee}</p>
            <p className="text-[10px] text-muted-foreground">kcal</p>
          </div>
          <div className="rounded-lg bg-primary/10 p-3 border border-primary/30">
            <p className="text-xs text-primary">Target</p>
            <p className="text-lg font-bold text-primary">{dailyCalories}</p>
            <p className="text-[10px] text-primary/70">kcal/day</p>
          </div>
        </div>

        {goalAdj !== 0 && (
          <p className="text-xs text-muted-foreground text-center">
            {goalAdj > 0 ? "+" : ""}
            {goalAdj} kcal adjustment for{" "}
            {goalLabels[goal]?.toLowerCase()}
          </p>
        )}

        {/* Macro Split */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <UtensilsCrossed className="w-4 h-4 text-primary" />
            Macro Split
          </div>

          {/* Visual Bar */}
          <div className="w-full h-4 rounded-full overflow-hidden flex bg-muted">
            <div
              className="bg-blue-500 h-full transition-all"
              style={{ width: `${proteinPct}%` }}
            />
            <div
              className="bg-amber-500 h-full transition-all"
              style={{ width: `${carbsPct}%` }}
            />
            <div
              className="bg-rose-500 h-full transition-all"
              style={{ width: `${fatPct}%` }}
            />
          </div>

          {/* Macro Details */}
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="space-y-0.5">
              <div className="flex items-center justify-center gap-1">
                <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                <span className="text-xs text-muted-foreground">Protein</span>
              </div>
              <p className="text-sm font-bold text-foreground">
                {macros.protein}g
              </p>
              <p className="text-[10px] text-muted-foreground">{proteinPct}%</p>
            </div>
            <div className="space-y-0.5">
              <div className="flex items-center justify-center gap-1">
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span className="text-xs text-muted-foreground">Carbs</span>
              </div>
              <p className="text-sm font-bold text-foreground">
                {macros.carbs}g
              </p>
              <p className="text-[10px] text-muted-foreground">{carbsPct}%</p>
            </div>
            <div className="space-y-0.5">
              <div className="flex items-center justify-center gap-1">
                <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                <span className="text-xs text-muted-foreground">Fat</span>
              </div>
              <p className="text-sm font-bold text-foreground">
                {macros.fat}g
              </p>
              <p className="text-[10px] text-muted-foreground">{fatPct}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Dietary Restrictions */}
      {data.dietaryRestrictions && data.dietaryRestrictions.length > 0 && (
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-xs text-muted-foreground mb-2">Restrictions</p>
          <div className="flex flex-wrap gap-1.5">
            {data.dietaryRestrictions.map((r) => (
              <span
                key={r}
                className="inline-flex items-center px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium"
              >
                {r}
              </span>
            ))}
          </div>
        </div>
      )}

      {data.allergies && data.allergies.length > 0 && (
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-xs text-muted-foreground mb-2">Allergies</p>
          <div className="flex flex-wrap gap-1.5">
            {data.allergies.map((a) => (
              <span
                key={a}
                className="inline-flex items-center px-2.5 py-1 rounded-full bg-destructive/10 text-destructive text-xs font-medium"
              >
                {a}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

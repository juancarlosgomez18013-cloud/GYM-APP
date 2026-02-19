"use client";

import { TrendingDown, Dumbbell, RefreshCw, Scale, Target } from "lucide-react";
import { cn } from "@/lib/utils";
import type { OnboardingForm } from "./OnboardingWizard";

interface StepGoalSelectionProps {
  form: OnboardingForm;
}

const goals = [
  {
    value: "weight_loss" as const,
    label: "Weight Loss",
    description: "Lose fat while preserving muscle",
    icon: TrendingDown,
    color: "text-red-400",
    bgColor: "bg-red-400/10",
  },
  {
    value: "muscle_gain" as const,
    label: "Muscle Gain",
    description: "Build muscle with a caloric surplus",
    icon: Dumbbell,
    color: "text-blue-400",
    bgColor: "bg-blue-400/10",
  },
  {
    value: "recomposition" as const,
    label: "Recomposition",
    description: "Lose fat and gain muscle simultaneously",
    icon: RefreshCw,
    color: "text-purple-400",
    bgColor: "bg-purple-400/10",
  },
  {
    value: "maintenance" as const,
    label: "Maintenance",
    description: "Maintain current weight and physique",
    icon: Scale,
    color: "text-emerald-400",
    bgColor: "bg-emerald-400/10",
  },
];

export function StepGoalSelection({ form }: StepGoalSelectionProps) {
  const {
    watch,
    setValue,
    formState: { errors },
  } = form;
  const selectedGoal = watch("goal");

  return (
    <div className="space-y-5">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-3">
          <Target className="w-6 h-6 text-primary" />
        </div>
        <h2 className="text-xl font-bold text-foreground">Your Goal</h2>
        <p className="text-sm text-muted-foreground mt-1">
          What do you want to achieve?
        </p>
      </div>

      <div className="space-y-3">
        {goals.map((goal) => {
          const Icon = goal.icon;
          const isSelected = selectedGoal === goal.value;

          return (
            <button
              key={goal.value}
              type="button"
              onClick={() =>
                setValue("goal", goal.value, { shouldValidate: true })
              }
              className={cn(
                "w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-200 text-left",
                isSelected
                  ? "border-primary bg-primary/5 shadow-lg shadow-primary/10"
                  : "border-border bg-card hover:border-primary/40 hover:bg-card/80"
              )}
            >
              <div
                className={cn(
                  "flex items-center justify-center w-12 h-12 rounded-lg shrink-0",
                  isSelected ? "bg-primary/20" : goal.bgColor
                )}
              >
                <Icon
                  className={cn(
                    "w-6 h-6",
                    isSelected ? "text-primary" : goal.color
                  )}
                />
              </div>
              <div className="flex-1 min-w-0">
                <p
                  className={cn(
                    "font-semibold text-sm",
                    isSelected ? "text-primary" : "text-foreground"
                  )}
                >
                  {goal.label}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {goal.description}
                </p>
              </div>
              <div
                className={cn(
                  "w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center transition-all",
                  isSelected
                    ? "border-primary bg-primary"
                    : "border-muted-foreground/30"
                )}
              >
                {isSelected && (
                  <div className="w-2 h-2 rounded-full bg-primary-foreground" />
                )}
              </div>
            </button>
          );
        })}
      </div>

      {errors.goal && (
        <p className="text-xs text-destructive text-center">
          {errors.goal.message}
        </p>
      )}
    </div>
  );
}

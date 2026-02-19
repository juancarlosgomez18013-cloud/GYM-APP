"use client";

import { Armchair, Footprints, Bike, Flame, Zap, Activity } from "lucide-react";
import { cn } from "@/lib/utils";
import type { OnboardingForm } from "./OnboardingWizard";

interface StepActivityLevelProps {
  form: OnboardingForm;
}

const activityLevels = [
  {
    value: "sedentary" as const,
    label: "Sedentary",
    description: "Desk job, little exercise",
    icon: Armchair,
    multiplier: "1.2x",
  },
  {
    value: "lightly_active" as const,
    label: "Lightly Active",
    description: "Light exercise 1-3 days/week",
    icon: Footprints,
    multiplier: "1.375x",
  },
  {
    value: "moderately_active" as const,
    label: "Moderately Active",
    description: "Moderate exercise 3-5 days/week",
    icon: Bike,
    multiplier: "1.55x",
  },
  {
    value: "active" as const,
    label: "Active",
    description: "Hard exercise 6-7 days/week",
    icon: Flame,
    multiplier: "1.725x",
  },
  {
    value: "very_active" as const,
    label: "Very Active",
    description: "Intense training or physical job",
    icon: Zap,
    multiplier: "1.9x",
  },
];

export function StepActivityLevel({ form }: StepActivityLevelProps) {
  const {
    watch,
    setValue,
    formState: { errors },
  } = form;
  const selectedLevel = watch("activityLevel");

  return (
    <div className="space-y-5">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-3">
          <Activity className="w-6 h-6 text-primary" />
        </div>
        <h2 className="text-xl font-bold text-foreground">Activity Level</h2>
        <p className="text-sm text-muted-foreground mt-1">
          How active are you on a typical week?
        </p>
      </div>

      <div className="space-y-2.5">
        {activityLevels.map((level) => {
          const Icon = level.icon;
          const isSelected = selectedLevel === level.value;

          return (
            <button
              key={level.value}
              type="button"
              onClick={() =>
                setValue("activityLevel", level.value, {
                  shouldValidate: true,
                })
              }
              className={cn(
                "w-full flex items-center gap-3 p-3.5 rounded-xl border-2 transition-all duration-200 text-left",
                isSelected
                  ? "border-primary bg-primary/5 shadow-lg shadow-primary/10"
                  : "border-border bg-card hover:border-primary/40 hover:bg-card/80"
              )}
            >
              <div
                className={cn(
                  "flex items-center justify-center w-10 h-10 rounded-lg shrink-0 transition-colors",
                  isSelected
                    ? "bg-primary/20 text-primary"
                    : "bg-muted text-muted-foreground"
                )}
              >
                <Icon className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p
                    className={cn(
                      "font-semibold text-sm",
                      isSelected ? "text-primary" : "text-foreground"
                    )}
                  >
                    {level.label}
                  </p>
                  <span className="text-xs text-muted-foreground font-mono">
                    {level.multiplier}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {level.description}
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

      {errors.activityLevel && (
        <p className="text-xs text-destructive text-center">
          {errors.activityLevel.message}
        </p>
      )}
    </div>
  );
}

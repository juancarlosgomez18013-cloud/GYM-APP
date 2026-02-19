"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { User, Ruler, Weight } from "lucide-react";
import type { OnboardingForm } from "./OnboardingWizard";

interface StepPersonalInfoProps {
  form: OnboardingForm;
}

export function StepPersonalInfo({ form }: StepPersonalInfoProps) {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = form;

  const unitSystem = watch("unitSystem");
  const sex = watch("sex");

  const handleUnitToggle = (unit: "metric" | "imperial") => {
    const currentUnit = watch("unitSystem");
    if (currentUnit === unit) return;
    setValue("unitSystem", unit);
  };

  // Conversion helpers for display
  const cmToInches = (cm: number) => Math.round((cm / 2.54) * 10) / 10;
  const inchesToCm = (inches: number) => Math.round(inches * 2.54 * 10) / 10;
  const kgToLbs = (kg: number) => Math.round(kg * 2.20462 * 10) / 10;
  const lbsToKg = (lbs: number) => Math.round((lbs / 2.20462) * 10) / 10;

  return (
    <div className="space-y-5">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-3">
          <User className="w-6 h-6 text-primary" />
        </div>
        <h2 className="text-xl font-bold text-foreground">Personal Info</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Tell us about yourself to personalize your plan
        </p>
      </div>

      {/* Name */}
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input id="name" placeholder="Your name" {...register("name")} />
        {errors.name && (
          <p className="text-xs text-destructive">{errors.name.message}</p>
        )}
      </div>

      {/* Sex Toggle */}
      <div className="space-y-2">
        <Label>Sex</Label>
        <div className="grid grid-cols-2 gap-2">
          <Button
            type="button"
            variant={sex === "male" ? "default" : "outline"}
            className={
              sex === "male"
                ? "bg-primary text-primary-foreground"
                : "border-border"
            }
            onClick={() => setValue("sex", "male", { shouldValidate: true })}
          >
            Male
          </Button>
          <Button
            type="button"
            variant={sex === "female" ? "default" : "outline"}
            className={
              sex === "female"
                ? "bg-primary text-primary-foreground"
                : "border-border"
            }
            onClick={() => setValue("sex", "female", { shouldValidate: true })}
          >
            Female
          </Button>
        </div>
        {errors.sex && (
          <p className="text-xs text-destructive">{errors.sex.message}</p>
        )}
      </div>

      {/* Age */}
      <div className="space-y-2">
        <Label htmlFor="age">Age</Label>
        <Input
          id="age"
          type="number"
          placeholder="25"
          min={13}
          max={120}
          {...register("age", { valueAsNumber: true })}
        />
        {errors.age && (
          <p className="text-xs text-destructive">{errors.age.message}</p>
        )}
      </div>

      {/* Unit System Toggle */}
      <div className="space-y-2">
        <Label>Unit System</Label>
        <div className="grid grid-cols-2 gap-2">
          <Button
            type="button"
            variant={unitSystem === "metric" ? "default" : "outline"}
            className={
              unitSystem === "metric"
                ? "bg-primary text-primary-foreground"
                : "border-border"
            }
            onClick={() => handleUnitToggle("metric")}
          >
            Metric (cm/kg)
          </Button>
          <Button
            type="button"
            variant={unitSystem === "imperial" ? "default" : "outline"}
            className={
              unitSystem === "imperial"
                ? "bg-primary text-primary-foreground"
                : "border-border"
            }
            onClick={() => handleUnitToggle("imperial")}
          >
            Imperial (in/lbs)
          </Button>
        </div>
      </div>

      {/* Height */}
      <div className="space-y-2">
        <Label htmlFor="height" className="flex items-center gap-2">
          <Ruler className="w-4 h-4 text-muted-foreground" />
          Height ({unitSystem === "metric" ? "cm" : "inches"})
        </Label>
        {unitSystem === "metric" ? (
          <Input
            id="height"
            type="number"
            placeholder="175"
            min={100}
            max={280}
            step={1}
            {...register("heightCm", { valueAsNumber: true })}
          />
        ) : (
          <Input
            id="height"
            type="number"
            placeholder="69"
            min={39}
            max={110}
            step={0.1}
            value={
              watch("heightCm") && !isNaN(watch("heightCm"))
                ? cmToInches(watch("heightCm"))
                : ""
            }
            onChange={(e) => {
              const inches = parseFloat(e.target.value);
              if (!isNaN(inches)) {
                setValue("heightCm", inchesToCm(inches), {
                  shouldValidate: true,
                });
              }
            }}
          />
        )}
        {errors.heightCm && (
          <p className="text-xs text-destructive">{errors.heightCm.message}</p>
        )}
      </div>

      {/* Weight */}
      <div className="space-y-2">
        <Label htmlFor="weight" className="flex items-center gap-2">
          <Weight className="w-4 h-4 text-muted-foreground" />
          Weight ({unitSystem === "metric" ? "kg" : "lbs"})
        </Label>
        {unitSystem === "metric" ? (
          <Input
            id="weight"
            type="number"
            placeholder="70"
            min={25}
            max={350}
            step={0.1}
            {...register("weightKg", { valueAsNumber: true })}
          />
        ) : (
          <Input
            id="weight"
            type="number"
            placeholder="154"
            min={55}
            max={770}
            step={0.1}
            value={
              watch("weightKg") && !isNaN(watch("weightKg"))
                ? kgToLbs(watch("weightKg"))
                : ""
            }
            onChange={(e) => {
              const lbs = parseFloat(e.target.value);
              if (!isNaN(lbs)) {
                setValue("weightKg", lbsToKg(lbs), {
                  shouldValidate: true,
                });
              }
            }}
          />
        )}
        {errors.weightKg && (
          <p className="text-xs text-destructive">{errors.weightKg.message}</p>
        )}
      </div>
    </div>
  );
}

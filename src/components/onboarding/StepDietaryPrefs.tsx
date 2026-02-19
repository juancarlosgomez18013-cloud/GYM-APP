"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  UtensilsCrossed,
  Salad,
  Beef,
  Flame,
  Fish,
  BarChart3,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { OnboardingForm } from "./OnboardingWizard";

interface StepDietaryPrefsProps {
  form: OnboardingForm;
}

const countries = [
  "Mexico",
  "Colombia",
  "Argentina",
  "Peru",
  "Brazil",
  "USA",
  "Spain",
  "Italy",
  "France",
  "Germany",
  "UK",
  "Japan",
  "China",
  "India",
  "Thailand",
  "Korea",
  "Lebanon",
  "Turkey",
  "Morocco",
  "Nigeria",
  "Australia",
];

const dietTypes = [
  {
    value: "balanced" as const,
    label: "Balanced",
    description: "A well-rounded approach",
    icon: Salad,
  },
  {
    value: "high_protein" as const,
    label: "High Protein",
    description: "Prioritize protein intake",
    icon: Beef,
  },
  {
    value: "keto" as const,
    label: "Keto",
    description: "High fat, low carb",
    icon: Flame,
  },
  {
    value: "mediterranean" as const,
    label: "Mediterranean",
    description: "Heart-healthy whole foods",
    icon: Fish,
  },
  {
    value: "iifym" as const,
    label: "IIFYM",
    description: "If It Fits Your Macros",
    icon: BarChart3,
  },
];

const restrictionOptions = [
  "Vegetarian",
  "Vegan",
  "Gluten Free",
  "Dairy Free",
  "Nut Free",
  "Halal",
  "Kosher",
];

export function StepDietaryPrefs({ form }: StepDietaryPrefsProps) {
  const {
    watch,
    setValue,
    formState: { errors },
  } = form;

  const selectedDiet = watch("dietType");
  const selectedCountry = watch("country");
  const selectedLanguage = watch("language") || "en";
  const dietaryRestrictions = watch("dietaryRestrictions") || [];

  const toggleRestriction = (restriction: string) => {
    const current = dietaryRestrictions;
    if (current.includes(restriction)) {
      setValue(
        "dietaryRestrictions",
        current.filter((r) => r !== restriction),
        { shouldValidate: true }
      );
    } else {
      setValue("dietaryRestrictions", [...current, restriction], {
        shouldValidate: true,
      });
    }
  };

  return (
    <div className="space-y-5">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-3">
          <UtensilsCrossed className="w-6 h-6 text-primary" />
        </div>
        <h2 className="text-xl font-bold text-foreground">
          Dietary Preferences
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Customize your nutrition plan
        </p>
      </div>

      {/* Country Selector */}
      <div className="space-y-2">
        <Label>Country</Label>
        <Select
          value={selectedCountry}
          onValueChange={(value) =>
            setValue("country", value, { shouldValidate: true })
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select your country" />
          </SelectTrigger>
          <SelectContent>
            {countries.map((country) => (
              <SelectItem key={country} value={country.toLowerCase()}>
                {country}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.country && (
          <p className="text-xs text-destructive">{errors.country.message}</p>
        )}
      </div>

      {/* Diet Type */}
      <div className="space-y-2">
        <Label>Diet Type</Label>
        <div className="grid grid-cols-2 gap-2">
          {dietTypes.map((diet) => {
            const Icon = diet.icon;
            const isSelected = selectedDiet === diet.value;

            return (
              <button
                key={diet.value}
                type="button"
                onClick={() =>
                  setValue("dietType", diet.value, { shouldValidate: true })
                }
                className={cn(
                  "flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all duration-200",
                  isSelected
                    ? "border-primary bg-primary/5 shadow-md shadow-primary/10"
                    : "border-border bg-card hover:border-primary/40"
                )}
              >
                <Icon
                  className={cn(
                    "w-5 h-5",
                    isSelected ? "text-primary" : "text-muted-foreground"
                  )}
                />
                <span
                  className={cn(
                    "text-xs font-semibold",
                    isSelected ? "text-primary" : "text-foreground"
                  )}
                >
                  {diet.label}
                </span>
                <span className="text-[10px] text-muted-foreground leading-tight text-center">
                  {diet.description}
                </span>
              </button>
            );
          })}
        </div>
        {errors.dietType && (
          <p className="text-xs text-destructive">{errors.dietType.message}</p>
        )}
      </div>

      {/* Dietary Restrictions */}
      <div className="space-y-2">
        <Label>Dietary Restrictions</Label>
        <div className="flex flex-wrap gap-2">
          {restrictionOptions.map((restriction) => {
            const isSelected = dietaryRestrictions.includes(restriction);
            return (
              <Badge
                key={restriction}
                variant={isSelected ? "default" : "outline"}
                className={cn(
                  "cursor-pointer select-none transition-all px-3 py-1.5 text-xs",
                  isSelected
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "hover:bg-accent hover:text-accent-foreground border-border"
                )}
                onClick={() => toggleRestriction(restriction)}
              >
                {restriction}
              </Badge>
            );
          })}
        </div>
      </div>

      {/* Allergies */}
      <div className="space-y-2">
        <Label htmlFor="allergies">Allergies (comma-separated)</Label>
        <Input
          id="allergies"
          placeholder="e.g., peanuts, shellfish"
          value={(watch("allergies") || []).join(", ")}
          onChange={(e) => {
            const value = e.target.value;
            if (value.trim() === "") {
              setValue("allergies", [], { shouldValidate: true });
            } else {
              setValue(
                "allergies",
                value
                  .split(",")
                  .map((s) => s.trim())
                  .filter(Boolean),
                { shouldValidate: true }
              );
            }
          }}
        />
      </div>

      {/* Language Selector */}
      <div className="space-y-2">
        <Label>Language</Label>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() =>
              setValue("language", "en", { shouldValidate: true })
            }
            className={cn(
              "flex items-center justify-center gap-2 p-2.5 rounded-xl border-2 transition-all duration-200 text-sm font-medium",
              selectedLanguage === "en"
                ? "border-primary bg-primary/5 text-primary"
                : "border-border bg-card text-foreground hover:border-primary/40"
            )}
          >
            EN - English
          </button>
          <button
            type="button"
            onClick={() =>
              setValue("language", "es", { shouldValidate: true })
            }
            className={cn(
              "flex items-center justify-center gap-2 p-2.5 rounded-xl border-2 transition-all duration-200 text-sm font-medium",
              selectedLanguage === "es"
                ? "border-primary bg-primary/5 text-primary"
                : "border-border bg-card text-foreground hover:border-primary/40"
            )}
          >
            ES - Espanol
          </button>
        </div>
      </div>
    </div>
  );
}

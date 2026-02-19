"use client";

import { useState } from "react";
import { useForm, type UseFormReturn, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { nanoid } from "nanoid";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, ChevronRight, Check, Dumbbell } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUserStore } from "@/stores/user-store";
import {
  onboardingSchema,
  type OnboardingFormData,
} from "@/lib/utils/validators";
import { StepPersonalInfo } from "./StepPersonalInfo";
import { StepGoalSelection } from "./StepGoalSelection";
import { StepActivityLevel } from "./StepActivityLevel";
import { StepDietaryPrefs } from "./StepDietaryPrefs";
import { StepReview } from "./StepReview";

const TOTAL_STEPS = 5;

const stepLabels = [
  "Personal Info",
  "Your Goal",
  "Activity Level",
  "Diet Preferences",
  "Review",
];

// Fields required per step for validation
type StepFields = (keyof OnboardingFormData)[];
const stepValidationFields: StepFields[] = [
  ["name", "sex", "age", "heightCm", "weightKg", "unitSystem"],
  ["goal"],
  ["activityLevel"],
  ["country", "dietType"],
  [], // Review step - no additional validation
];

export type OnboardingForm = UseFormReturn<
  OnboardingFormData,
  unknown,
  OnboardingFormData
>;

export function OnboardingWizard() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const setProfile = useUserStore((s) => s.setProfile);

  const form = useForm<OnboardingFormData, unknown, OnboardingFormData>({
    resolver: zodResolver(onboardingSchema) as Resolver<
      OnboardingFormData,
      unknown,
      OnboardingFormData
    >,
    defaultValues: {
      name: "",
      sex: undefined,
      age: undefined as unknown as number,
      heightCm: undefined as unknown as number,
      weightKg: undefined as unknown as number,
      unitSystem: "metric",
      goal: undefined,
      activityLevel: undefined,
      dietType: "balanced",
      country: "",
      language: "en",
      dietaryRestrictions: [],
      allergies: [],
    },
    mode: "onTouched",
  });

  const progressValue = ((currentStep + 1) / TOTAL_STEPS) * 100;

  const handleNext = async () => {
    const fieldsToValidate = stepValidationFields[currentStep];

    if (fieldsToValidate.length > 0) {
      const isValid = await form.trigger(fieldsToValidate);
      if (!isValid) return;
    }

    if (currentStep < TOTAL_STEPS - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    const isValid = await form.trigger();
    if (!isValid) return;

    setIsSubmitting(true);

    try {
      const formData = form.getValues();

      setProfile({
        id: nanoid(),
        name: formData.name,
        sex: formData.sex,
        age: formData.age,
        heightCm: formData.heightCm,
        weightKg: formData.weightKg,
        unitSystem: formData.unitSystem,
        goal: formData.goal,
        activityLevel: formData.activityLevel,
        dietType: formData.dietType,
        country: formData.country,
        language: formData.language,
        dietaryRestrictions: formData.dietaryRestrictions,
        allergies: formData.allergies,
        targetWeightKg: formData.targetWeightKg,
        weightLog: [
          {
            date: new Date().toISOString().split("T")[0],
            weightKg: formData.weightKg,
          },
        ],
        onboardingComplete: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      router.push("/dashboard");
    } catch {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <StepPersonalInfo form={form} />;
      case 1:
        return <StepGoalSelection form={form} />;
      case 2:
        return <StepActivityLevel form={form} />;
      case 3:
        return <StepDietaryPrefs form={form} />;
      case 4:
        return <StepReview form={form} />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 mb-2">
          <Dumbbell className="w-7 h-7 text-primary" />
        </div>
        <h1 className="text-2xl font-bold text-foreground tracking-tight">
          GymFuel
        </h1>
        <p className="text-sm text-muted-foreground">
          Set up your personalized nutrition plan
        </p>
      </div>

      {/* Progress */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">
            Step {currentStep + 1} of {TOTAL_STEPS}
          </span>
          <span className="text-primary font-medium">
            {stepLabels[currentStep]}
          </span>
        </div>
        <Progress value={progressValue} className="h-2" />
        {/* Step Dots */}
        <div className="flex justify-between px-1 pt-1">
          {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
            <div
              key={i}
              className={cn(
                "w-2 h-2 rounded-full transition-all duration-300",
                i < currentStep
                  ? "bg-primary"
                  : i === currentStep
                    ? "bg-primary scale-125"
                    : "bg-muted"
              )}
            />
          ))}
        </div>
      </div>

      {/* Step Content */}
      <Card className="border-border bg-card/50 backdrop-blur-sm">
        <CardContent className="pt-2">{renderStep()}</CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex items-center gap-3">
        {currentStep > 0 && (
          <Button
            type="button"
            variant="outline"
            onClick={handleBack}
            className="flex-1"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back
          </Button>
        )}

        {currentStep < TOTAL_STEPS - 1 ? (
          <Button
            type="button"
            onClick={handleNext}
            className={cn(
              "flex-1 bg-primary text-primary-foreground hover:bg-primary/90",
              currentStep === 0 && "w-full"
            )}
          >
            Next
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        ) : (
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                Setting up...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Check className="w-4 h-4" />
                Confirm & Start
              </span>
            )}
          </Button>
        )}
      </div>
    </div>
  );
}

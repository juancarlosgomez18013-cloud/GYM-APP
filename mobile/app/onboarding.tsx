import { useState } from "react";
import { View, Text, Pressable, TextInput, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { nanoid } from "nanoid";
import { Button } from "@/components/ui/Button";
import { GradientButton } from "@/components/ui/GradientButton";
import { Card, CardContent } from "@/components/ui/Card";
import { COLORS } from "@/constants/theme";
import { haptic } from "@/lib/haptics";
import { useUserStore } from "@/stores/user-store";
import type { Sex, ActivityLevel, FitnessGoal, DietType, UserProfile } from "@/types/user";

const STEPS = ["Personal Info", "Your Goal", "Activity Level", "Diet Preferences", "Review"];

export default function OnboardingScreen() {
  const router = useRouter();
  const setProfile = useUserStore((s) => s.setProfile);
  const [step, setStep] = useState(0);

  // Form data
  const [name, setName] = useState("");
  const [sex, setSex] = useState<Sex>("male");
  const [age, setAge] = useState("25");
  const [heightCm, setHeightCm] = useState("175");
  const [weightKg, setWeightKg] = useState("75");
  const [goal, setGoal] = useState<FitnessGoal>("maintenance");
  const [activity, setActivity] = useState<ActivityLevel>("moderately_active");
  const [dietType, setDietType] = useState<DietType>("balanced");
  const [country, setCountry] = useState("US");

  const next = () => { haptic.selection(); if (step < 4) setStep(step + 1); };
  const back = () => { haptic.light(); if (step > 0) setStep(step - 1); };

  const finish = () => {
    haptic.success();
    const profile: UserProfile = {
      id: nanoid(), name: name.trim() || "User", sex, age: Number(age) || 25,
      heightCm: Number(heightCm) || 175, weightKg: Number(weightKg) || 75,
      activityLevel: activity, goal, dietType, unitSystem: "metric",
      country, language: "en", dietaryRestrictions: [], allergies: [],
      onboardingComplete: true, weightLog: [{ date: new Date().toISOString().split("T")[0], weightKg: Number(weightKg) || 75 }],
      createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    };
    setProfile(profile);
    router.replace("/(tabs)");
  };

  const Option = ({ label, selected, onPress, desc }: { label: string; selected: boolean; onPress: () => void; desc?: string }) => (
    <Pressable onPress={onPress} className={`rounded-xl border px-4 py-3 mb-2 ${selected ? "border-primary bg-primary/10" : "border-border"}`}>
      <Text className={`text-sm font-medium ${selected ? "text-primary" : "text-foreground"}`}>{label}</Text>
      {desc && <Text className="text-xs text-muted-foreground mt-0.5">{desc}</Text>}
    </Pressable>
  );

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <View className="gap-3">
            <Text className="text-lg font-semibold text-foreground mb-2">Tell us about yourself</Text>
            <View>
              <Text className="text-sm font-medium text-foreground mb-1.5">Name</Text>
              <TextInput value={name} onChangeText={setName} placeholder="Your name" placeholderTextColor={COLORS.mutedForeground} className="bg-accent border border-border rounded-xl px-4 py-3 text-foreground" />
            </View>
            <Text className="text-sm font-medium text-foreground mb-1">Sex</Text>
            <View className="flex-row gap-3">
              {(["male", "female"] as Sex[]).map((s) => (
                <Pressable key={s} onPress={() => setSex(s)} className={`flex-1 rounded-xl border py-3 items-center ${sex === s ? "border-primary bg-primary/10" : "border-border"}`}>
                  <Text className={sex === s ? "text-primary font-medium" : "text-foreground"}>{s === "male" ? "Male" : "Female"}</Text>
                </Pressable>
              ))}
            </View>
            <View className="flex-row gap-3">
              <View className="flex-1">
                <Text className="text-sm font-medium text-foreground mb-1.5">Age</Text>
                <TextInput value={age} onChangeText={setAge} keyboardType="numeric" className="bg-accent border border-border rounded-xl px-4 py-3 text-foreground" />
              </View>
              <View className="flex-1">
                <Text className="text-sm font-medium text-foreground mb-1.5">Height (cm)</Text>
                <TextInput value={heightCm} onChangeText={setHeightCm} keyboardType="numeric" className="bg-accent border border-border rounded-xl px-4 py-3 text-foreground" />
              </View>
            </View>
            <View>
              <Text className="text-sm font-medium text-foreground mb-1.5">Weight (kg)</Text>
              <TextInput value={weightKg} onChangeText={setWeightKg} keyboardType="numeric" className="bg-accent border border-border rounded-xl px-4 py-3 text-foreground" />
            </View>
          </View>
        );
      case 1:
        return (
          <View>
            <Text className="text-lg font-semibold text-foreground mb-4">What's your goal?</Text>
            <Option label="Weight Loss" desc="Lose fat while preserving muscle" selected={goal === "weight_loss"} onPress={() => setGoal("weight_loss")} />
            <Option label="Muscle Gain" desc="Build lean muscle with a surplus" selected={goal === "muscle_gain"} onPress={() => setGoal("muscle_gain")} />
            <Option label="Body Recomposition" desc="Lose fat and build muscle simultaneously" selected={goal === "recomposition"} onPress={() => setGoal("recomposition")} />
            <Option label="Maintenance" desc="Maintain current weight and composition" selected={goal === "maintenance"} onPress={() => setGoal("maintenance")} />
          </View>
        );
      case 2:
        return (
          <View>
            <Text className="text-lg font-semibold text-foreground mb-4">Activity Level</Text>
            <Option label="Sedentary" desc="Little or no exercise" selected={activity === "sedentary"} onPress={() => setActivity("sedentary")} />
            <Option label="Lightly Active" desc="1-3 days/week" selected={activity === "lightly_active"} onPress={() => setActivity("lightly_active")} />
            <Option label="Moderately Active" desc="3-5 days/week" selected={activity === "moderately_active"} onPress={() => setActivity("moderately_active")} />
            <Option label="Active" desc="6-7 days/week" selected={activity === "active"} onPress={() => setActivity("active")} />
            <Option label="Very Active" desc="Twice/day or physical job" selected={activity === "very_active"} onPress={() => setActivity("very_active")} />
          </View>
        );
      case 3:
        return (
          <View>
            <Text className="text-lg font-semibold text-foreground mb-4">Diet Preferences</Text>
            <Option label="Balanced" desc="Equal macro distribution" selected={dietType === "balanced"} onPress={() => setDietType("balanced")} />
            <Option label="High Protein" desc="Emphasis on protein intake" selected={dietType === "high_protein"} onPress={() => setDietType("high_protein")} />
            <Option label="Keto" desc="Low carb, high fat" selected={dietType === "keto"} onPress={() => setDietType("keto")} />
            <Option label="Mediterranean" desc="Whole grains, healthy fats, lean protein" selected={dietType === "mediterranean"} onPress={() => setDietType("mediterranean")} />
            <View className="mt-4">
              <Text className="text-sm font-medium text-foreground mb-1.5">Country</Text>
              <TextInput value={country} onChangeText={setCountry} placeholder="Your country" placeholderTextColor={COLORS.mutedForeground} className="bg-accent border border-border rounded-xl px-4 py-3 text-foreground" />
            </View>
          </View>
        );
      case 4:
        return (
          <View>
            <Text className="text-lg font-semibold text-foreground mb-4">Review Your Profile</Text>
            <Card>
              <CardContent className="gap-2">
                {[
                  { l: "Name", v: name || "User" },
                  { l: "Sex", v: sex },
                  { l: "Age", v: `${age} years` },
                  { l: "Height", v: `${heightCm} cm` },
                  { l: "Weight", v: `${weightKg} kg` },
                  { l: "Goal", v: goal.replace("_", " ") },
                  { l: "Activity", v: activity.replace(/_/g, " ") },
                  { l: "Diet", v: dietType.replace("_", " ") },
                  { l: "Country", v: country },
                ].map((item) => (
                  <View key={item.l} className="flex-row justify-between py-1">
                    <Text className="text-sm text-muted-foreground">{item.l}</Text>
                    <Text className="text-sm font-medium text-foreground capitalize">{item.v}</Text>
                  </View>
                ))}
              </CardContent>
            </Card>
          </View>
        );
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="flex-1">
        {/* Progress */}
        <View className="px-4 pt-4 mb-2">
          <View className="flex-row gap-2">
            {STEPS.map((_, i) => (
              <View key={i} className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: COLORS.muted }}>
                {i <= step && (
                  <LinearGradient
                    colors={[COLORS.gradientStart, COLORS.gradientEnd]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    className="flex-1 rounded-full"
                  />
                )}
              </View>
            ))}
          </View>
          <Text className="text-xs text-muted-foreground mt-2">Step {step + 1} of {STEPS.length} - {STEPS[step]}</Text>
        </View>

        <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
          {renderStep()}
        </ScrollView>

        {/* Navigation */}
        <View className="flex-row gap-3 px-4 py-4 border-t border-border">
          {step > 0 && <Button variant="outline" onPress={back} className="flex-1"><Text className="text-foreground">Back</Text></Button>}
          {step < 4 ? (
            <GradientButton onPress={next} className="flex-1">
              <Text className="text-sm font-bold text-primary-foreground">Next</Text>
            </GradientButton>
          ) : (
            <GradientButton onPress={finish} className="flex-1">
              <Text className="text-sm font-bold text-primary-foreground">Complete Setup</Text>
            </GradientButton>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

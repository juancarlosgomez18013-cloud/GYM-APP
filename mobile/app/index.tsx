import { useEffect } from "react";
import { View, Text, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { useUserStore } from "@/stores/user-store";
import { Ionicons } from "@expo/vector-icons";

export default function LandingPage() {
  const router = useRouter();
  const profile = useUserStore((s) => s.profile);

  useEffect(() => {
    if (profile?.onboardingComplete) {
      router.replace("/(tabs)");
    }
  }, [profile]);

  return (
    <View className="flex-1 bg-background items-center justify-center px-6">
      <View className="items-center mb-12">
        <View className="w-20 h-20 rounded-full bg-primary/20 items-center justify-center mb-4">
          <Ionicons name="nutrition" size={40} color="#4ade80" />
        </View>
        <Text className="text-4xl font-bold text-foreground">GymFuel</Text>
        <Text className="text-base text-muted-foreground mt-2 text-center">
          AI-Powered Diet Planner{"\n"}& Calorie Tracker
        </Text>
      </View>

      <View className="w-full gap-3">
        <Pressable
          className="w-full bg-primary rounded-xl py-4 items-center active:opacity-80"
          onPress={() => router.push("/onboarding")}
        >
          <Text className="text-primary-foreground font-semibold text-base">
            Get Started
          </Text>
        </Pressable>
      </View>

      <View className="mt-8 flex-row flex-wrap justify-center gap-4">
        {["AI Photo Scanner", "Calorie Tracking", "Intermittent Fasting", "Streak System"].map((feature) => (
          <View key={feature} className="bg-card rounded-lg px-3 py-2">
            <Text className="text-xs text-muted-foreground">{feature}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

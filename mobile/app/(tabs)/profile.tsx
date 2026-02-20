import { useState } from "react";
import { View, Text, Pressable, TextInput, Alert } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { COLORS } from "@/constants/theme";
import { haptic } from "@/lib/haptics";
import { useUserStore } from "@/stores/user-store";
import { useDailyLogStore } from "@/stores/daily-log-store";

export default function ProfileScreen() {
  const profile = useUserStore((s) => s.profile);
  const updateProfile = useUserStore((s) => s.updateProfile);
  const addWeightEntry = useUserStore((s) => s.addWeightEntry);
  const clearProfile = useUserStore((s) => s.clearProfile);
  const streakData = useDailyLogStore((s) => s.getStreakData());
  const router = useRouter();

  const [editing, setEditing] = useState(false);
  const [newWeight, setNewWeight] = useState("");

  if (!profile) {
    return (
      <PageContainer>
        <View className="flex-1 items-center justify-center">
          <Text className="text-foreground">No profile found</Text>
          <Button onPress={() => router.replace("/onboarding")} className="mt-4">Set Up Profile</Button>
        </View>
      </PageContainer>
    );
  }

  const handleWeightLog = () => {
    const w = Number(newWeight);
    if (w > 0 && w < 500) { haptic.success(); addWeightEntry(w); setNewWeight(""); Alert.alert("Logged!", `Weight updated to ${w}kg`); }
  };

  return (
    <PageContainer>
      {/* Header with gradient avatar ring */}
      <View className="items-center mb-6 pt-2">
        <View className="w-24 h-24 rounded-full overflow-hidden p-0.5 mb-3">
          <LinearGradient
            colors={[COLORS.gradientStart, COLORS.gradientEnd]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="flex-1 rounded-full p-0.5"
          >
            <View className="flex-1 rounded-full bg-background items-center justify-center">
              <Ionicons name="person" size={36} color={COLORS.primary} />
            </View>
          </LinearGradient>
        </View>
        <Text className="text-xl font-bold text-foreground">{profile.name}</Text>
        <Badge variant="secondary" className="mt-1">{profile.goal.replace("_", " ")}</Badge>
      </View>

      {/* Stats */}
      <Card className="mb-4">
        <CardContent>
          <View className="flex-row">
            <View className="flex-1 items-center">
              <Text className="text-2xl font-bold text-primary">{streakData.current}</Text>
              <Text className="text-xs text-muted-foreground">Current Streak</Text>
            </View>
            <View className="flex-1 items-center">
              <Text className="text-2xl font-bold text-primary">{streakData.longest}</Text>
              <Text className="text-xs text-muted-foreground">Best Streak</Text>
            </View>
            <View className="flex-1 items-center">
              <Text className="text-2xl font-bold text-primary">{streakData.totalDaysLogged}</Text>
              <Text className="text-xs text-muted-foreground">Days Logged</Text>
            </View>
          </View>
        </CardContent>
      </Card>

      {/* Personal Info */}
      <Card className="mb-4">
        <CardHeader><CardTitle>Personal Info</CardTitle></CardHeader>
        <CardContent className="gap-2">
          {[
            { label: "Age", value: `${profile.age} years` },
            { label: "Height", value: `${profile.heightCm} cm` },
            { label: "Weight", value: `${profile.weightKg} kg` },
            { label: "Activity", value: profile.activityLevel.replace("_", " ") },
            { label: "Diet Type", value: profile.dietType.replace("_", " ") },
            { label: "Country", value: profile.country },
          ].map((item) => (
            <View key={item.label} className="flex-row justify-between py-1.5">
              <Text className="text-sm text-muted-foreground">{item.label}</Text>
              <Text className="text-sm font-medium text-foreground capitalize">{item.value}</Text>
            </View>
          ))}
        </CardContent>
      </Card>

      {/* Weight Log */}
      <Card className="mb-4">
        <CardHeader><CardTitle>Log Weight</CardTitle></CardHeader>
        <CardContent>
          <View className="flex-row gap-3">
            <TextInput
              value={newWeight} onChangeText={setNewWeight} placeholder="e.g. 75.5" placeholderTextColor={COLORS.mutedForeground}
              keyboardType="numeric" className="flex-1 bg-accent border border-border rounded-xl px-4 py-3 text-foreground text-sm"
            />
            <Button onPress={handleWeightLog} disabled={!newWeight}>
              <Text className="text-sm font-semibold text-primary-foreground">Log</Text>
            </Button>
          </View>
          {profile.weightLog.length > 0 && (
            <View className="mt-3 gap-1">
              {profile.weightLog.slice(-5).reverse().map((entry, i) => (
                <View key={i} className="flex-row justify-between py-1">
                  <Text className="text-xs text-muted-foreground">{entry.date}</Text>
                  <Text className="text-xs text-foreground">{entry.weightKg} kg</Text>
                </View>
              ))}
            </View>
          )}
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="mb-4">
        <CardContent>
          <Button
            variant="destructive"
            onPress={() => Alert.alert("Reset Profile", "Are you sure? This will delete all your data.", [
              { text: "Cancel", style: "cancel" },
              { text: "Reset", style: "destructive", onPress: () => { clearProfile(); router.replace("/"); } },
            ])}
          >
            <Text className="text-sm font-semibold text-white">Reset Profile</Text>
          </Button>
        </CardContent>
      </Card>
    </PageContainer>
  );
}

import { useState, useEffect } from "react";
import { View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { FastingTimer } from "@/components/fasting/FastingTimer";
import { ProtocolSelector } from "@/components/fasting/ProtocolSelector";
import { FastingTimeline } from "@/components/fasting/FastingTimeline";
import { useFastingStore } from "@/stores/fasting-store";
import { FASTING_PROTOCOLS } from "@/types/fasting";
import type { FastingProtocol } from "@/types/fasting";
import { COLORS } from "@/constants/theme";

function getProtocolHours(protocol: FastingProtocol, cf: number, ce: number) {
  if (protocol === "custom") return { fasting: cf, eating: ce };
  const f = FASTING_PROTOCOLS.find((p) => p.id === protocol);
  return f ? { fasting: f.fastingHours, eating: f.eatingHours } : { fasting: 16, eating: 8 };
}

export default function FastingScreen() {
  const currentSession = useFastingStore((s) => s.currentSession);
  const sessionHistory = useFastingStore((s) => s.sessionHistory);
  const settings = useFastingStore((s) => s.settings);
  const startFast = useFastingStore((s) => s.startFast);
  const endFast = useFastingStore((s) => s.endFast);
  const cancelFast = useFastingStore((s) => s.cancelFast);
  const updateSettings = useFastingStore((s) => s.updateSettings);
  const getTimeRemaining = useFastingStore((s) => s.getTimeRemaining);

  const [selected, setSelected] = useState<FastingProtocol>(settings.preferredProtocol);
  const [customF, setCustomF] = useState(settings.customFastingHours);
  const [customE, setCustomE] = useState(settings.customEatingHours);
  const [timeData, setTimeData] = useState(getTimeRemaining());

  useEffect(() => {
    const iv = setInterval(() => setTimeData(getTimeRemaining()), 1000);
    return () => clearInterval(iv);
  }, [getTimeRemaining]);

  const handleStart = () => {
    updateSettings({ preferredProtocol: selected, customFastingHours: customF, customEatingHours: customE });
    startFast(selected, selected === "custom" ? { fasting: customF, eating: customE } : undefined);
  };

  const hours = getProtocolHours(selected, customF, customE);
  let elapsedHours = 0;
  let phase: "fasting" | "eating" | "idle" = "idle";
  if (currentSession && timeData) {
    elapsedHours = (Date.now() - new Date(currentSession.startTime).getTime()) / 3600000;
    phase = timeData.phase;
  }
  const completedFasts = sessionHistory.filter((s) => s.completed).length;

  return (
    <PageContainer>
      <View className="mb-6 flex-row items-center gap-3">
        <View className="w-10 h-10 rounded-full bg-primary/10 items-center justify-center">
          <Ionicons name="timer-outline" size={20} color={COLORS.primary} />
        </View>
        <View>
          <Text className="text-xl font-bold text-foreground">Intermittent Fasting</Text>
          <Text className="text-sm text-muted-foreground">Track your fasting windows</Text>
        </View>
      </View>

      {/* Timer */}
      <Card className="mb-4">
        <CardContent className="items-center py-2">
          <FastingTimer size={220} />
          {currentSession && (
            <View className="mt-6 w-full">
              <FastingTimeline fastingHours={hours.fasting} eatingHours={hours.eating} elapsedHours={elapsedHours} phase={phase} />
            </View>
          )}
          <View className="flex-row gap-3 mt-6 w-full">
            {!currentSession ? (
              <Button onPress={handleStart} className="flex-1">
                <View className="flex-row items-center gap-2">
                  <Ionicons name="play" size={16} color={COLORS.primaryForeground} />
                  <Text className="text-sm font-semibold text-primary-foreground">
                    Start Fast ({selected === "custom" ? `${customF}:${customE}` : selected})
                  </Text>
                </View>
              </Button>
            ) : (
              <>
                <Button onPress={endFast} className="flex-1">
                  <View className="flex-row items-center gap-2">
                    <Ionicons name="stop" size={16} color={COLORS.primaryForeground} />
                    <Text className="text-sm font-semibold text-primary-foreground">End Fast</Text>
                  </View>
                </Button>
                <Button variant="outline" onPress={cancelFast} className="flex-1">
                  <View className="flex-row items-center gap-2">
                    <Ionicons name="close-circle-outline" size={16} color={COLORS.foreground} />
                    <Text className="text-sm text-foreground">Cancel</Text>
                  </View>
                </Button>
              </>
            )}
          </View>
        </CardContent>
      </Card>

      {/* Protocol selector */}
      {!currentSession && (
        <Card className="mb-4">
          <CardHeader><CardTitle>Choose Protocol</CardTitle></CardHeader>
          <CardContent>
            <ProtocolSelector selected={selected} onSelect={setSelected} customFastingHours={customF} customEatingHours={customE} onCustomChange={(f, e) => { setCustomF(f); setCustomE(e); }} />
          </CardContent>
        </Card>
      )}

      {/* Stats */}
      <Card className="mb-4">
        <CardHeader><CardTitle>Stats</CardTitle></CardHeader>
        <CardContent>
          <View className="flex-row">
            <View className="flex-1 items-center">
              <Text className="text-2xl font-bold text-primary">{completedFasts}</Text>
              <Text className="text-xs text-muted-foreground">Completed</Text>
            </View>
            <View className="flex-1 items-center">
              <Text className="text-2xl font-bold text-primary">{sessionHistory.length}</Text>
              <Text className="text-xs text-muted-foreground">Total Sessions</Text>
            </View>
          </View>
        </CardContent>
      </Card>

      {/* History */}
      {sessionHistory.length > 0 && (
        <Card className="mb-4">
          <CardHeader>
            <View className="flex-row items-center gap-2">
              <Ionicons name="time-outline" size={16} color={COLORS.foreground} />
              <CardTitle>Recent History</CardTitle>
            </View>
          </CardHeader>
          <CardContent className="gap-2">
            {sessionHistory.slice(0, 10).map((session) => {
              const start = new Date(session.startTime);
              const dateStr = start.toLocaleDateString("en-US", { month: "short", day: "numeric" });
              const timeStr = start.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
              return (
                <View key={session.id} className="flex-row items-center justify-between rounded-lg bg-muted/20 px-3 py-2">
                  <View className="flex-row items-center gap-2">
                    <Ionicons name={session.completed ? "checkmark-circle" : "close-circle"} size={16} color={session.completed ? "#22c55e" : "#ef4444"} />
                    <View>
                      <Text className="text-sm font-medium text-foreground">{session.protocol === "custom" ? "Custom" : session.protocol}</Text>
                      <Text className="text-xs text-muted-foreground">{dateStr} at {timeStr}</Text>
                    </View>
                  </View>
                  <Badge variant={session.completed ? "default" : "secondary"}>{session.completed ? "Completed" : "Cancelled"}</Badge>
                </View>
              );
            })}
          </CardContent>
        </Card>
      )}
    </PageContainer>
  );
}

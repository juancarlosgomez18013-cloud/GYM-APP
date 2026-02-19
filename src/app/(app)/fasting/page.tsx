"use client";

import { useState, useEffect } from "react";
import { Timer, History, Play, Square, XCircle, CheckCircle2 } from "lucide-react";
import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FastingTimer } from "@/components/fasting/FastingTimer";
import { ProtocolSelector } from "@/components/fasting/ProtocolSelector";
import { FastingTimeline } from "@/components/fasting/FastingTimeline";
import { useFastingStore } from "@/stores/fasting-store";
import type { FastingProtocol } from "@/types/fasting";
import { FASTING_PROTOCOLS } from "@/types/fasting";

function getProtocolHours(protocol: FastingProtocol, customFasting: number, customEating: number) {
  if (protocol === "custom") return { fasting: customFasting, eating: customEating };
  const found = FASTING_PROTOCOLS.find((p) => p.id === protocol);
  return found
    ? { fasting: found.fastingHours, eating: found.eatingHours }
    : { fasting: 16, eating: 8 };
}

export default function FastingPage() {
  const currentSession = useFastingStore((s) => s.currentSession);
  const sessionHistory = useFastingStore((s) => s.sessionHistory);
  const settings = useFastingStore((s) => s.settings);
  const startFast = useFastingStore((s) => s.startFast);
  const endFast = useFastingStore((s) => s.endFast);
  const cancelFast = useFastingStore((s) => s.cancelFast);
  const updateSettings = useFastingStore((s) => s.updateSettings);
  const getTimeRemaining = useFastingStore((s) => s.getTimeRemaining);

  const [selectedProtocol, setSelectedProtocol] = useState<FastingProtocol>(
    settings.preferredProtocol
  );
  const [customFastingHours, setCustomFastingHours] = useState(
    settings.customFastingHours
  );
  const [customEatingHours, setCustomEatingHours] = useState(
    settings.customEatingHours
  );
  const [timeData, setTimeData] = useState(getTimeRemaining());

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeData(getTimeRemaining());
    }, 1000);
    return () => clearInterval(interval);
  }, [getTimeRemaining]);

  const handleStartFast = () => {
    updateSettings({
      preferredProtocol: selectedProtocol,
      customFastingHours,
      customEatingHours,
    });
    startFast(
      selectedProtocol,
      selectedProtocol === "custom"
        ? { fasting: customFastingHours, eating: customEatingHours }
        : undefined
    );
  };

  const handleCustomChange = (fasting: number, eating: number) => {
    setCustomFastingHours(fasting);
    setCustomEatingHours(eating);
  };

  const hours = getProtocolHours(selectedProtocol, customFastingHours, customEatingHours);

  // Calculate elapsed hours for timeline
  let elapsedHours = 0;
  let phase: "fasting" | "eating" | "idle" = "idle";
  if (currentSession && timeData) {
    const startMs = new Date(currentSession.startTime).getTime();
    const nowMs = Date.now();
    elapsedHours = (nowMs - startMs) / (1000 * 60 * 60);
    phase = timeData.phase;
  }

  const completedFasts = sessionHistory.filter((s) => s.completed).length;

  return (
    <PageContainer>
      {/* Header */}
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
          <Timer className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-foreground">
            Intermittent Fasting
          </h1>
          <p className="text-sm text-muted-foreground">
            Track your fasting windows
          </p>
        </div>
      </div>

      {/* Timer */}
      <Card className="mb-4">
        <CardContent className="flex flex-col items-center py-6">
          <FastingTimer size={220} />

          {/* Timeline */}
          {currentSession && (
            <div className="mt-6 w-full">
              <FastingTimeline
                fastingHours={hours.fasting}
                eatingHours={hours.eating}
                elapsedHours={elapsedHours}
                phase={phase}
              />
            </div>
          )}

          {/* Action buttons */}
          <div className="mt-6 flex w-full gap-3">
            {!currentSession ? (
              <Button className="w-full" onClick={handleStartFast}>
                <Play className="mr-2 h-4 w-4" />
                Start Fast ({selectedProtocol === "custom" ? `${customFastingHours}:${customEatingHours}` : selectedProtocol})
              </Button>
            ) : (
              <>
                <Button className="flex-1" onClick={endFast}>
                  <Square className="mr-2 h-4 w-4" />
                  End Fast
                </Button>
                <Button variant="outline" className="flex-1" onClick={cancelFast}>
                  <XCircle className="mr-2 h-4 w-4" />
                  Cancel
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Protocol selector (only show when no active fast) */}
      {!currentSession && (
        <Card className="mb-4">
          <CardHeader>
            <CardTitle className="text-base">Choose Protocol</CardTitle>
          </CardHeader>
          <CardContent>
            <ProtocolSelector
              selected={selectedProtocol}
              onSelect={setSelectedProtocol}
              customFastingHours={customFastingHours}
              customEatingHours={customEatingHours}
              onCustomChange={handleCustomChange}
            />
          </CardContent>
        </Card>
      )}

      {/* Stats */}
      <Card className="mb-4">
        <CardHeader>
          <CardTitle className="text-base">Stats</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">
                {completedFasts}
              </p>
              <p className="text-xs text-muted-foreground">Completed Fasts</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">
                {sessionHistory.length}
              </p>
              <p className="text-xs text-muted-foreground">Total Sessions</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* History */}
      {sessionHistory.length > 0 && (
        <Card className="mb-4">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <History className="h-4 w-4" />
              Recent History
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2">
              {sessionHistory.slice(0, 10).map((session) => {
                const start = new Date(session.startTime);
                const dateStr = start.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
                const timeStr = start.toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                });
                return (
                  <div
                    key={session.id}
                    className="flex items-center justify-between rounded-lg bg-muted/20 px-3 py-2"
                  >
                    <div className="flex items-center gap-2">
                      {session.completed ? (
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-500" />
                      )}
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {session.protocol === "custom"
                            ? "Custom"
                            : session.protocol}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {dateStr} at {timeStr}
                        </p>
                      </div>
                    </div>
                    <Badge
                      variant={session.completed ? "default" : "secondary"}
                      className="text-[10px]"
                    >
                      {session.completed ? "Completed" : "Cancelled"}
                    </Badge>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </PageContainer>
  );
}

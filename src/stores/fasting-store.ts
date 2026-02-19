import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { nanoid } from "nanoid";
import type {
  FastingProtocol,
  FastingSession,
  FastingSettings,
  FASTING_PROTOCOLS,
} from "@/types/fasting";

interface FastingState {
  settings: FastingSettings;
  currentSession: FastingSession | null;
  sessionHistory: FastingSession[];
  startFast: (
    protocol: FastingProtocol,
    customHours?: { fasting: number; eating: number }
  ) => void;
  endFast: () => void;
  cancelFast: () => void;
  updateSettings: (updates: Partial<FastingSettings>) => void;
  isInFastingWindow: () => boolean;
  isInEatingWindow: () => boolean;
  getTimeRemaining: () => {
    hours: number;
    minutes: number;
    seconds: number;
    phase: "fasting" | "eating";
    totalSeconds: number;
    totalPhaseDuration: number;
  } | null;
}

function getProtocolHours(protocol: FastingProtocol): {
  fasting: number;
  eating: number;
} {
  const map: Record<string, { fasting: number; eating: number }> = {
    "16:8": { fasting: 16, eating: 8 },
    "18:6": { fasting: 18, eating: 6 },
    "20:4": { fasting: 20, eating: 4 },
    "23:1": { fasting: 23, eating: 1 },
  };
  return map[protocol] ?? { fasting: 16, eating: 8 };
}

export const useFastingStore = create<FastingState>()(
  persist(
    (set, get) => ({
      settings: {
        preferredProtocol: "16:8",
        customFastingHours: 16,
        customEatingHours: 8,
      },
      currentSession: null,
      sessionHistory: [],

      startFast: (protocol, customHours) => {
        const now = new Date();
        const hours =
          protocol === "custom" && customHours
            ? customHours
            : getProtocolHours(protocol);

        const targetEndTime = new Date(
          now.getTime() + hours.fasting * 60 * 60 * 1000
        );
        const eatingWindowEnd = new Date(
          targetEndTime.getTime() + hours.eating * 60 * 60 * 1000
        );

        const session: FastingSession = {
          id: nanoid(),
          protocol,
          startTime: now.toISOString(),
          targetEndTime: targetEndTime.toISOString(),
          eatingWindowEnd: eatingWindowEnd.toISOString(),
          completed: false,
        };

        set({ currentSession: session });
      },

      endFast: () => {
        const { currentSession } = get();
        if (!currentSession) return;

        const completedSession: FastingSession = {
          ...currentSession,
          actualEndTime: new Date().toISOString(),
          completed: true,
        };

        set((state) => ({
          currentSession: null,
          sessionHistory: [completedSession, ...state.sessionHistory].slice(
            0,
            100
          ),
        }));
      },

      cancelFast: () => {
        set({ currentSession: null });
      },

      updateSettings: (updates) => {
        set((state) => ({
          settings: { ...state.settings, ...updates },
        }));
      },

      isInFastingWindow: () => {
        const { currentSession } = get();
        if (!currentSession) return false;
        const now = new Date();
        return now < new Date(currentSession.targetEndTime);
      },

      isInEatingWindow: () => {
        const { currentSession } = get();
        if (!currentSession) return false;
        const now = new Date();
        return (
          now >= new Date(currentSession.targetEndTime) &&
          now < new Date(currentSession.eatingWindowEnd)
        );
      },

      getTimeRemaining: () => {
        const { currentSession } = get();
        if (!currentSession) return null;

        const now = new Date();
        const fastEnd = new Date(currentSession.targetEndTime);
        const eatEnd = new Date(currentSession.eatingWindowEnd);
        const fastStart = new Date(currentSession.startTime);

        if (now >= eatEnd) return null;

        let targetTime: Date;
        let phase: "fasting" | "eating";
        let totalPhaseDuration: number;

        if (now < fastEnd) {
          targetTime = fastEnd;
          phase = "fasting";
          totalPhaseDuration = (fastEnd.getTime() - fastStart.getTime()) / 1000;
        } else {
          targetTime = eatEnd;
          phase = "eating";
          totalPhaseDuration = (eatEnd.getTime() - fastEnd.getTime()) / 1000;
        }

        const diffMs = targetTime.getTime() - now.getTime();
        const totalSeconds = Math.max(0, Math.floor(diffMs / 1000));
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        return { hours, minutes, seconds, phase, totalSeconds, totalPhaseDuration };
      },
    }),
    {
      name: "gymfuel-fasting",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

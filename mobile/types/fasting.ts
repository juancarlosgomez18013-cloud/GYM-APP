export type FastingProtocol = "16:8" | "18:6" | "20:4" | "23:1" | "custom";

export interface FastingProtocolConfig {
  id: FastingProtocol;
  label: string;
  fastingHours: number;
  eatingHours: number;
  description: string;
}

export const FASTING_PROTOCOLS: FastingProtocolConfig[] = [
  { id: "16:8", label: "16:8", fastingHours: 16, eatingHours: 8, description: "Most popular. Fast 16 hours, eat within 8 hours." },
  { id: "18:6", label: "18:6", fastingHours: 18, eatingHours: 6, description: "Intermediate. Fast 18 hours, eat within 6 hours." },
  { id: "20:4", label: "20:4", fastingHours: 20, eatingHours: 4, description: "Warrior diet. Fast 20 hours, eat within 4 hours." },
  { id: "23:1", label: "OMAD", fastingHours: 23, eatingHours: 1, description: "One Meal A Day. Fast 23 hours, 1 hour eating window." },
];

export interface FastingSession {
  id: string;
  protocol: FastingProtocol;
  startTime: string;
  targetEndTime: string;
  eatingWindowEnd: string;
  actualEndTime?: string;
  completed: boolean;
}

export interface FastingSettings {
  preferredProtocol: FastingProtocol;
  customFastingHours: number;
  customEatingHours: number;
}

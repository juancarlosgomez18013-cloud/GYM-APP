export const COLORS = {
  background: "#0a1a0f",
  foreground: "#f5f5f5",
  card: "#142218",
  cardForeground: "#f5f5f5",
  primary: "#4ade80",
  primaryForeground: "#0a1a0f",
  muted: "#2a3d30",
  mutedForeground: "#9ca3af",
  border: "#2a3d30",
  destructive: "#ef4444",
  accent: "#1a2e20",
  accentForeground: "#f5f5f5",
  macroProtein: "#3b82f6",
  macroCarbs: "#eab308",
  macroFat: "#f43f5e",
  amber400: "#fbbf24",
  green400: "#4ade80",
  orange400: "#fb923c",
  red400: "#f87171",
  blue400: "#60a5fa",
  // Gradient colors
  gradientStart: "#4ade80",
  gradientEnd: "#2dd4bf",
  gradientGold: "#fbbf24",
  gradientOrange: "#fb923c",
  // Glassmorphism
  glassBackground: "rgba(20, 34, 24, 0.65)",
  glassBorder: "rgba(74, 222, 128, 0.12)",
} as const;

export const WATER_GOAL_ML = 2500;
export const WATER_STEP_ML = 250;

// Animation durations (ms)
export const ANIM = {
  fast: 150,
  normal: 300,
  slow: 500,
  spring: { damping: 15, stiffness: 150 },
} as const;

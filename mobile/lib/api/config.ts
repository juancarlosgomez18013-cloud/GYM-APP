// For development, point to your local Next.js dev server
// For production, point to your deployed backend (e.g., Vercel)
export const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || "http://localhost:3000";
export const USDA_API_KEY = process.env.EXPO_PUBLIC_USDA_API_KEY || "";
export const ANTHROPIC_API_KEY = process.env.EXPO_PUBLIC_ANTHROPIC_API_KEY || "";

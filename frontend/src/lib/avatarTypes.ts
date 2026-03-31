export interface AvatarConfig {
  skinTone:   string;
  hairStyle:  HairStyle;
  hairColor:  string;
  eyeStyle:   EyeStyle;
  eyeColor:   string;
  mouthStyle: MouthStyle;
  glasses:    GlassesStyle;
  bgColor:    string;
}

export type HairStyle  = "none" | "short" | "long" | "curly" | "bun" | "mohawk";
export type EyeStyle   = "normal" | "happy" | "sleepy" | "star" | "heart";
export type MouthStyle = "smile" | "grin" | "neutral" | "surprised" | "cool";
export type GlassesStyle = "none" | "round" | "square" | "cat";

export const SKIN_TONES = ["#FDDBB4", "#F5C89A", "#E8A87C", "#C68642", "#8D5524", "#4A2912"];
export const HAIR_COLORS = ["#1a1a1a", "#4a3728", "#8B4513", "#D2691E", "#DAA520", "#FFD700", "#FF6B6B", "#9B59B6", "#3498DB", "#E8E8E8"];
export const EYE_COLORS  = ["#4a3728", "#2980B9", "#27AE60", "#8E44AD", "#E67E22", "#95A5A6"];
export const BG_COLORS   = ["#6366f1", "#8b5cf6", "#ec4899", "#f43f5e", "#f97316", "#eab308", "#22c55e", "#14b8a6", "#0ea5e9", "#64748b"];

export const DEFAULT_AVATAR: AvatarConfig = {
  skinTone:   "#FDDBB4",
  hairStyle:  "short",
  hairColor:  "#4a3728",
  eyeStyle:   "normal",
  eyeColor:   "#4a3728",
  mouthStyle: "smile",
  glasses:    "none",
  bgColor:    "#6366f1",
};

export function loadAvatar(): AvatarConfig {
  try {
    const raw = localStorage.getItem("mindly-avatar-v2");
    if (raw) return { ...DEFAULT_AVATAR, ...JSON.parse(raw) };
  } catch {}
  return { ...DEFAULT_AVATAR };
}

export function saveAvatar(cfg: AvatarConfig) {
  localStorage.setItem("mindly-avatar-v2", JSON.stringify(cfg));
}

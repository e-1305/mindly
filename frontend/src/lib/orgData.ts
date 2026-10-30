import { AvatarConfig } from "./avatarTypes";

export type OrgRole = "hr" | "manager" | "lead" | "employee";

export interface OrgMember {
  id: string;
  name: string;
  role: OrgRole;
  groupId: string;
  managerId?: string;
  mood: number;
  energy: number;
  stress: number;
  mentalLoad: number;
  streak: number;
  avatar: Partial<AvatarConfig>;
}

export type AvatarShape = "circle" | "rounded" | "hexagon" | "diamond"; // kept for legacy compat

// Emotion color scale — used for heatmap nodes
export function wellbeingScore(m: OrgMember): number {
  // Higher mood/energy = good, higher stress/mentalLoad = bad
  return (m.mood + m.energy + (6 - m.stress) + (6 - m.mentalLoad)) / 4;
}

export function scoreToColor(score: number): string {
  if (score >= 4.2) return "#22c55e"; // thriving
  if (score >= 3.4) return "#84cc16"; // good
  if (score >= 2.6) return "#facc15"; // neutral
  if (score >= 1.8) return "#f97316"; // low
  return "#ef4444";                   // critical
}

export function scoreToLabel(score: number): string {
  if (score >= 4.2) return "Thriving";
  if (score >= 3.4) return "Good";
  if (score >= 2.6) return "Neutral";
  if (score >= 1.8) return "Low";
  return "Critical";
}

export const AVATAR_COLORS = [
  "#6366f1", "#8b5cf6", "#ec4899", "#f43f5e",
  "#f97316", "#eab308", "#22c55e", "#14b8a6",
  "#0ea5e9", "#64748b",
];

// ── Mock org tree ──────────────────────────────────────────────
export const ORG: OrgMember[] = [
  { id: "hr-1",   name: "Isabelle Roux",   role: "hr",       groupId: "root",    mood: 4, energy: 4, stress: 2, mentalLoad: 2, streak: 20, avatar: { bgColor: "#6366f1", hairStyle: "bun",    hairColor: "#1a1a1a", eyeStyle: "normal", mouthStyle: "smile",   glasses: "none",   skinTone: "#F5C89A" } },
  { id: "mgr-1",  name: "Sophie Martin",   role: "manager",  groupId: "eng",     managerId: "hr-1",   mood: 4, energy: 3, stress: 2, mentalLoad: 3, streak: 12, avatar: { bgColor: "#8b5cf6", hairStyle: "long",   hairColor: "#4a3728", eyeStyle: "happy",  mouthStyle: "grin",    glasses: "none",   skinTone: "#FDDBB4" } },
  { id: "lead-1", name: "Thomas Bernard",  role: "lead",     groupId: "eng",     managerId: "mgr-1",  mood: 3, energy: 4, stress: 3, mentalLoad: 2, streak: 7,  avatar: { bgColor: "#14b8a6", hairStyle: "short",  hairColor: "#1a1a1a", eyeStyle: "normal", mouthStyle: "neutral", glasses: "square", skinTone: "#E8A87C" } },
  { id: "emp-1",  name: "Alex Dupont",     role: "employee", groupId: "eng",     managerId: "lead-1", mood: 4, energy: 3, stress: 2, mentalLoad: 3, streak: 5,  avatar: { bgColor: "#22c55e", hairStyle: "curly",  hairColor: "#8B4513", eyeStyle: "normal", mouthStyle: "smile",   glasses: "round",  skinTone: "#C68642" } },
  { id: "emp-2",  name: "Lucas Moreau",    role: "employee", groupId: "eng",     managerId: "lead-1", mood: 4, energy: 5, stress: 2, mentalLoad: 3, streak: 10, avatar: { bgColor: "#0ea5e9", hairStyle: "mohawk", hairColor: "#3498DB", eyeStyle: "star",   mouthStyle: "cool",    glasses: "none",   skinTone: "#FDDBB4" } },
  { id: "emp-3",  name: "Camille Petit",   role: "employee", groupId: "eng",     managerId: "lead-1", mood: 1, energy: 2, stress: 5, mentalLoad: 5, streak: 2,  avatar: { bgColor: "#f43f5e", hairStyle: "long",   hairColor: "#FF6B6B", eyeStyle: "sleepy", mouthStyle: "neutral", glasses: "cat",    skinTone: "#FDDBB4" } },
  { id: "mgr-2",  name: "Marc Lefebvre",   role: "manager",  groupId: "product", managerId: "hr-1",   mood: 3, energy: 3, stress: 3, mentalLoad: 3, streak: 8,  avatar: { bgColor: "#f97316", hairStyle: "short",  hairColor: "#4a3728", eyeStyle: "normal", mouthStyle: "smile",   glasses: "none",   skinTone: "#8D5524" } },
  { id: "lead-2", name: "Julie Fontaine",  role: "lead",     groupId: "product", managerId: "mgr-2",  mood: 4, energy: 4, stress: 2, mentalLoad: 2, streak: 15, avatar: { bgColor: "#eab308", hairStyle: "bun",    hairColor: "#DAA520", eyeStyle: "happy",  mouthStyle: "grin",    glasses: "none",   skinTone: "#F5C89A" } },
  { id: "emp-4",  name: "Marie Leclerc",   role: "employee", groupId: "product", managerId: "lead-2", mood: 2, energy: 2, stress: 4, mentalLoad: 4, streak: 3,  avatar: { bgColor: "#ec4899", hairStyle: "long",   hairColor: "#9B59B6", eyeStyle: "sleepy", mouthStyle: "neutral", glasses: "round",  skinTone: "#FDDBB4" } },
  { id: "emp-5",  name: "Noah Girard",     role: "employee", groupId: "product", managerId: "lead-2", mood: 3, energy: 3, stress: 3, mentalLoad: 3, streak: 6,  avatar: { bgColor: "#64748b", hairStyle: "short",  hairColor: "#E8E8E8", eyeStyle: "normal", mouthStyle: "smile",   glasses: "square", skinTone: "#E8A87C" } },
  { id: "mgr-3",  name: "Léa Rousseau",    role: "manager",  groupId: "design",  managerId: "hr-1",   mood: 5, energy: 4, stress: 1, mentalLoad: 2, streak: 18, avatar: { bgColor: "#8b5cf6", hairStyle: "curly",  hairColor: "#FFD700", eyeStyle: "heart",  mouthStyle: "grin",    glasses: "cat",    skinTone: "#F5C89A" } },
  { id: "emp-6",  name: "Hugo Blanc",      role: "employee", groupId: "design",  managerId: "mgr-3",  mood: 4, energy: 4, stress: 2, mentalLoad: 2, streak: 9,  avatar: { bgColor: "#22c55e", hairStyle: "none",   hairColor: "#1a1a1a", eyeStyle: "normal", mouthStyle: "cool",    glasses: "none",   skinTone: "#C68642" } },
  { id: "emp-7",  name: "Emma Chevalier",  role: "employee", groupId: "design",  managerId: "mgr-3",  mood: 3, energy: 3, stress: 3, mentalLoad: 4, streak: 4,  avatar: { bgColor: "#14b8a6", hairStyle: "long",   hairColor: "#D2691E", eyeStyle: "normal", mouthStyle: "smile",   glasses: "none",   skinTone: "#E8A87C" } },
];

export const GROUPS = [
  { id: "eng",     label: "Engineering", color: "#6366f1" },
  { id: "product", label: "Product",     color: "#f97316" },
  { id: "design",  label: "Design",      color: "#8b5cf6" },
];

export function groupAvgScore(groupId: string): number {
  const members = ORG.filter((m) => m.groupId === groupId && m.role === "employee");
  if (!members.length) return 3;
  return members.reduce((s, m) => s + wellbeingScore(m), 0) / members.length;
}

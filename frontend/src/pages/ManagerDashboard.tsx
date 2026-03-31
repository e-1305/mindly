import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles, ShieldAlert, Users,
  Smile, Zap, Flame, Brain, Flame as FireIcon,
} from "lucide-react";
import Card from "../components/Card";
import NavBar from "../components/NavBar";
import AdvisorChat from "../components/AdvisorChat";
import { getAIInsights } from "../lib/api";

const MOCK_TEAM = [
  { name: "Alex Dupont",    mood: 4, energy: 3, stress: 2, mentalLoad: 3, streak: 5 },
  { name: "Marie Leclerc",  mood: 2, energy: 2, stress: 4, mentalLoad: 4, streak: 3 },
  { name: "Thomas Bernard", mood: 3, energy: 4, stress: 3, mentalLoad: 2, streak: 7 },
  { name: "Camille Petit",  mood: 1, energy: 2, stress: 5, mentalLoad: 5, streak: 2 },
  { name: "Lucas Moreau",   mood: 4, energy: 5, stress: 2, mentalLoad: 3, streak: 10 },
];

const MOCK_AI = `Based on this week's check-ins, 2 team members show signs of elevated stress and mental load — particularly on Thursday and Friday. Scores suggest potential overload. Consider redistributing workload or scheduling 1:1 check-ins. The team's average mood has dropped 0.8 points compared to last week.`;

const METRIC_ICONS = [
  { key: "mood",       icon: Smile, title: "Mood"   },
  { key: "energy",     icon: Zap,   title: "Energy" },
  { key: "stress",     icon: Flame, title: "Stress" },
  { key: "mentalLoad", icon: Brain, title: "Load"   },
];

function scoreColor(key: string, v: number) {
  const bad = key === "stress" || key === "mentalLoad";
  if (bad) return v >= 4 ? "#ef4444" : v === 3 ? "#f59e0b" : "#22c55e";
  return v >= 4 ? "#22c55e" : v === 3 ? "#f59e0b" : "#ef4444";
}

function initials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase();
}

const AVATAR_COLORS = ["#6366f1", "#8b5cf6", "#ec4899", "#f59e0b", "#14b8a6"];

export default function ManagerDashboard() {
  const [aiInsight, setAiInsight] = useState<string | null>(null);
  const [loadingAI, setLoadingAI] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);

  const atRisk = MOCK_TEAM.filter((m) => m.stress >= 4 || m.mood <= 2);

  const fetchAI = async () => {
    setLoadingAI(true);
    try {
      const res = await getAIInsights();
      setAiInsight(res.data.insight);
    } catch {
      setAiInsight(MOCK_AI);
    } finally {
      setLoadingAI(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface-muted pb-28 pt-6 md:pt-20 px-4 relative">
      {/* Ambient */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-violet-200/30 blur-3xl"
        />
      </div>

      <div className="max-w-lg mx-auto space-y-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <h1 className="text-2xl font-bold text-gray-800">Team overview</h1>
          <div className="flex items-center gap-1.5 bg-white rounded-full px-3 py-1.5 shadow-card text-xs text-gray-500">
            <Users size={13} />
            <span>{MOCK_TEAM.length} members</span>
          </div>
        </motion.div>

        {/* At-risk banner */}
        <AnimatePresence>
          {atRisk.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              className="bg-red-50 border border-red-100 rounded-3xl p-4 flex gap-3 items-start"
            >
              <motion.div
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <ShieldAlert size={20} className="text-red-400 mt-0.5 shrink-0" />
              </motion.div>
              <div>
                <p className="text-sm font-semibold text-red-700">
                  {atRisk.length} member{atRisk.length > 1 ? "s" : ""} may need attention
                </p>
                <p className="text-xs text-red-400 mt-0.5">
                  {atRisk.map((m) => m.name.split(" ")[0]).join(", ")} — high stress or low mood
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Team list */}
        <motion.div
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.07 } } }}
          initial="hidden"
          animate="show"
          className="space-y-2"
        >
          {MOCK_TEAM.map((member, i) => {
            const isExpanded = expanded === member.name;
            const isAtRisk = member.stress >= 4 || member.mood <= 2;

            return (
              <motion.div
                key={member.name}
                variants={{
                  hidden: { opacity: 0, x: -16 },
                  show:   { opacity: 1, x: 0, transition: { type: "spring", stiffness: 280, damping: 22 } },
                }}
              >
                <motion.div
                  layout
                  onClick={() => setExpanded(isExpanded ? null : member.name)}
                  className={`bg-white rounded-3xl px-5 py-4 shadow-card cursor-pointer border-2 transition-colors ${
                    isAtRisk ? "border-red-100" : "border-transparent"
                  }`}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                        style={{ backgroundColor: AVATAR_COLORS[i % AVATAR_COLORS.length] }}
                      >
                        {initials(member.name)}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800 text-sm">{member.name}</p>
                        <p className="text-xs text-gray-400">{member.streak} day streak</p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      {METRIC_ICONS.map(({ key, icon: Icon, title }) => {
                        const val = member[key as keyof typeof member] as number;
                        const color = scoreColor(key, val);
                        return (
                          <div key={key} className="flex flex-col items-center gap-0.5" title={title}>
                            <Icon size={13} style={{ color }} />
                            <span className="text-[11px] font-bold" style={{ color }}>{val}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-4 gap-2">
                          {METRIC_ICONS.map(({ key, icon: Icon, title }) => {
                            const val = member[key as keyof typeof member] as number;
                            const color = scoreColor(key, val);
                            return (
                              <div key={key} className="text-center rounded-2xl py-2" style={{ backgroundColor: color + "12" }}>
                                <Icon size={16} className="mx-auto mb-1" style={{ color }} />
                                <p className="text-xs font-bold" style={{ color }}>{val}/5</p>
                                <p className="text-[10px] text-gray-400 mt-0.5">{title}</p>
                              </div>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* AI Insights */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card glow>
            <div className="flex items-center gap-2 mb-3">
              <motion.div
                animate={{ rotate: [0, 15, -15, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <Sparkles size={18} className="text-primary-500" />
              </motion.div>
              <p className="font-semibold text-gray-800 text-sm">AI Insights</p>
            </div>

            <AnimatePresence mode="wait">
              {aiInsight ? (
                <motion.p
                  key="insight"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-gray-600 leading-relaxed"
                >
                  {aiInsight}
                </motion.p>
              ) : (
                <motion.button
                  key="btn"
                  onClick={fetchAI}
                  disabled={loadingAI}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  className="w-full py-3 rounded-2xl bg-primary-50 text-primary-600 text-sm font-medium hover:bg-primary-100 transition-colors disabled:opacity-50 relative overflow-hidden"
                >
                  {loadingAI ? (
                    <motion.span
                      animate={{ opacity: [1, 0.4, 1] }}
                      transition={{ duration: 1.2, repeat: Infinity }}
                    >
                      Analyzing team data…
                    </motion.span>
                  ) : (
                    "Generate insights with AI"
                  )}
                </motion.button>
              )}
            </AnimatePresence>
          </Card>
        </motion.div>
      </div>
      <AdvisorChat />
      <NavBar />
    </div>
  );
}

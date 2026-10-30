import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles, ShieldAlert, Users, Lock,
  Smile, Zap, Flame, Brain,
} from "lucide-react";
import Card from "../components/Card";
import NavBar from "../components/NavBar";
import AdvisorChat from "../components/AdvisorChat";
import { getAIInsights } from "../lib/api";

// Demo data. In production this comes from GET /insights/team, which only
// returns team aggregates and suppresses teams with fewer than MIN_GROUP_SIZE respondents.
const MIN_GROUP_SIZE = 5;
const MOCK_TEAM_SCORES = [
  { mood: 4, energy: 3, stress: 2, mentalLoad: 3 },
  { mood: 2, energy: 2, stress: 4, mentalLoad: 4 },
  { mood: 3, energy: 4, stress: 3, mentalLoad: 2 },
  { mood: 1, energy: 2, stress: 5, mentalLoad: 5 },
  { mood: 4, energy: 5, stress: 2, mentalLoad: 3 },
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

export default function ManagerDashboard() {
  const [aiInsight, setAiInsight] = useState<string | null>(null);
  const [loadingAI, setLoadingAI] = useState(false);

  const respondents = MOCK_TEAM_SCORES.length;
  const canShow = respondents >= MIN_GROUP_SIZE;
  const avg = (key: keyof (typeof MOCK_TEAM_SCORES)[number]) =>
    Math.round((MOCK_TEAM_SCORES.reduce((sum, m) => sum + m[key], 0) / respondents) * 10) / 10;
  const highStressCount = MOCK_TEAM_SCORES.filter((m) => m.stress >= 4 || m.mood <= 2).length;

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
            <span>{respondents} check-ins</span>
          </div>
        </motion.div>

        {/* Privacy notice */}
        <div className="flex items-center gap-2 bg-white rounded-2xl px-4 py-2.5 shadow-card text-xs text-gray-500">
          <Lock size={13} className="shrink-0" />
          <span>Anonymous team view: individual answers are never shown, and nothing is shown below {MIN_GROUP_SIZE} respondents.</span>
        </div>

        {canShow ? (
          <>
            {/* Team signal (count only, no names) */}
            <AnimatePresence>
              {highStressCount > 0 && (
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
                      {highStressCount} of {respondents} people report high stress or low mood
                    </p>
                    <p className="text-xs text-red-400 mt-0.5">
                      Look at team workload and meetings, and remind everyone your door is open.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Team averages */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
              <Card>
                <p className="font-semibold text-gray-800 text-sm mb-3">Team averages this week</p>
                <div className="grid grid-cols-4 gap-2">
                  {METRIC_ICONS.map(({ key, icon: Icon, title }) => {
                    const val = avg(key as keyof (typeof MOCK_TEAM_SCORES)[number]);
                    const color = scoreColor(key, Math.round(val));
                    return (
                      <div key={key} className="text-center rounded-2xl py-2" style={{ backgroundColor: color + "12" }}>
                        <Icon size={16} className="mx-auto mb-1" style={{ color }} />
                        <p className="text-xs font-bold" style={{ color }}>{val}/5</p>
                        <p className="text-[10px] text-gray-400 mt-0.5">{title}</p>
                      </div>
                    );
                  })}
                </div>
              </Card>
            </motion.div>
          </>
        ) : (
          <Card>
            <p className="text-sm text-gray-600">
              Not enough check-ins yet to show team data without identifying anyone (minimum {MIN_GROUP_SIZE}).
            </p>
          </Card>
        )}

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

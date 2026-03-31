import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Building2, Users, ShieldAlert, Sparkles, ChevronDown, ChevronUp } from "lucide-react";
import Card from "../components/Card";
import NavBar from "../components/NavBar";
import OrgHeatmap from "../components/OrgHeatmap";
import Avatar from "../components/Avatar";
import AdvisorChat from "../components/AdvisorChat";
import {
  ORG, GROUPS, wellbeingScore, scoreToColor, scoreToLabel, groupAvgScore, OrgMember,
} from "../lib/orgData";
import { getAIInsights } from "../lib/api";

const MOCK_AI = `Engineering team shows the most strain this week — Camille's scores are critical and warrant immediate attention. Product team is stable but Marie shows early burnout signals. Design team is the healthiest across all metrics. Recommend a 1:1 with Camille and a workload review for the Engineering lead.`;

function GroupCard({ groupId, label, color }: { groupId: string; label: string; color: string }) {
  const [open, setOpen] = useState(false);
  const members = ORG.filter((m) => m.groupId === groupId);
  const employees = members.filter((m) => m.role === "employee");
  const score = groupAvgScore(groupId);
  const statusColor = scoreToColor(score);
  const atRisk = employees.filter((m) => wellbeingScore(m) < 2.6);

  return (
    <motion.div
      layout
      className="bg-white rounded-3xl shadow-card overflow-hidden border-2"
      style={{ borderColor: open ? color + "40" : "transparent" }}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4"
      >
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
          <span className="font-semibold text-gray-800">{label}</span>
          <span
            className="text-xs px-2 py-0.5 rounded-full font-medium"
            style={{ backgroundColor: statusColor + "20", color: statusColor }}
          >
            {scoreToLabel(score)}
          </span>
          {atRisk.length > 0 && (
            <span className="text-xs bg-red-50 text-red-500 px-2 py-0.5 rounded-full font-medium">
              {atRisk.length} at risk
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 text-gray-400">
          <span className="text-xs">{employees.length} members</span>
          {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-4 space-y-2 border-t border-gray-50 pt-3">
              {members.map((m) => {
                const ws = wellbeingScore(m);
                const wc = scoreToColor(ws);
                return (
                  <motion.div
                    key={m.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center justify-between py-2 px-3 rounded-2xl"
                    style={{ backgroundColor: wc + "0d" }}
                  >
                    <div className="flex items-center gap-2.5">
                      <Avatar config={m.avatar} size={32} wellbeing={ws} />
                      <div>
                        <p className="text-sm font-medium text-gray-800">{m.name}</p>
                        <p className="text-[10px] text-gray-400 capitalize">{m.role}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        {[m.mood, m.energy, m.stress, m.mentalLoad].map((v, i) => (
                          <div
                            key={i}
                            className="w-1.5 rounded-full"
                            style={{
                              height: `${v * 5 + 4}px`,
                              backgroundColor: wc,
                              opacity: 0.6 + i * 0.1,
                            }}
                          />
                        ))}
                      </div>
                      <span
                        className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: wc + "20", color: wc }}
                      >
                        {ws.toFixed(1)}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function HRDashboard() {
  const [aiInsight, setAiInsight] = useState<string | null>(null);
  const [loadingAI, setLoadingAI] = useState(false);
  const [view, setView] = useState<"heatmap" | "groups">("heatmap");

  const totalAtRisk = ORG.filter((m) => m.role === "employee" && wellbeingScore(m) < 2.6).length;
  const totalEmployees = ORG.filter((m) => m.role === "employee").length;
  const orgScore = ORG.filter((m) => m.role === "employee")
    .reduce((s, m) => s + wellbeingScore(m), 0) / totalEmployees;

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
          animate={{ scale: [1, 1.12, 1], opacity: [0.2, 0.35, 0.2] }}
          transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-40 -right-20 w-[500px] h-[500px] rounded-full bg-primary-200/20 blur-3xl"
        />
      </div>

      <div className="max-w-2xl mx-auto space-y-4">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-widest">HR Dashboard</p>
            <h1 className="text-2xl font-bold text-gray-800 mt-0.5">Organisation</h1>
          </div>
          <div className="flex items-center gap-1.5 bg-white rounded-full px-3 py-1.5 shadow-card text-xs text-gray-500">
            <Building2 size={13} />
            <span>{totalEmployees} employees</span>
          </div>
        </motion.div>

        {/* KPI row */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-3 gap-3"
        >
          {[
            { label: "Org score",  value: orgScore.toFixed(1), color: scoreToColor(orgScore) },
            { label: "Teams",      value: GROUPS.length,       color: "#6366f1" },
            { label: "At risk",    value: totalAtRisk,         color: totalAtRisk > 0 ? "#ef4444" : "#22c55e" },
          ].map(({ label, value, color }) => (
            <Card key={label} className="text-center py-4">
              <p className="text-2xl font-bold" style={{ color }}>{value}</p>
              <p className="text-xs text-gray-400 mt-1">{label}</p>
            </Card>
          ))}
        </motion.div>

        {/* At-risk banner */}
        <AnimatePresence>
          {totalAtRisk > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              className="bg-red-50 border border-red-100 rounded-3xl p-4 flex gap-3 items-center"
            >
              <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity }}>
                <ShieldAlert size={20} className="text-red-400 shrink-0" />
              </motion.div>
              <div>
                <p className="text-sm font-semibold text-red-700">{totalAtRisk} employee{totalAtRisk > 1 ? "s" : ""} in critical or low state</p>
                <p className="text-xs text-red-400 mt-0.5">
                  {ORG.filter((m) => m.role === "employee" && wellbeingScore(m) < 2.6).map((m) => m.name.split(" ")[0]).join(", ")}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* View toggle */}
        <div className="flex bg-white rounded-2xl p-1 shadow-card gap-1">
          {(["heatmap", "groups"] as const).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className="relative flex-1 py-2 text-sm font-medium rounded-xl transition-colors capitalize"
            >
              {view === v && (
                <motion.div layoutId="view-pill" className="absolute inset-0 bg-primary-600 rounded-xl" />
              )}
              <span className={`relative z-10 transition-colors ${view === v ? "text-white" : "text-gray-500"}`}>
                {v === "heatmap" ? "Org graph" : "By group"}
              </span>
            </button>
          ))}
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {view === "heatmap" ? (
            <motion.div
              key="heatmap"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
            >
              <Card>
                <OrgHeatmap />
              </Card>
            </motion.div>
          ) : (
            <motion.div
              key="groups"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="space-y-3"
            >
              {GROUPS.map((g) => (
                <GroupCard key={g.id} groupId={g.id} label={g.label} color={g.color} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* AI Insights */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card glow>
            <div className="flex items-center gap-2 mb-3">
              <motion.div animate={{ rotate: [0, 15, -15, 0] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}>
                <Sparkles size={18} className="text-primary-500" />
              </motion.div>
              <p className="font-semibold text-gray-800 text-sm">AI Insights</p>
            </div>
            <AnimatePresence mode="wait">
              {aiInsight ? (
                <motion.p key="insight" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="text-sm text-gray-600 leading-relaxed">
                  {aiInsight}
                </motion.p>
              ) : (
                <motion.button
                  key="btn"
                  onClick={fetchAI}
                  disabled={loadingAI}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  className="w-full py-3 rounded-2xl bg-primary-50 text-primary-600 text-sm font-medium hover:bg-primary-100 transition-colors disabled:opacity-50"
                >
                  {loadingAI ? (
                    <motion.span animate={{ opacity: [1, 0.4, 1] }} transition={{ duration: 1.2, repeat: Infinity }}>
                      Analyzing org data…
                    </motion.span>
                  ) : "Generate org-wide insights"}
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

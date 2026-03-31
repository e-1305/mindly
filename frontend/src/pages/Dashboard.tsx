import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis,
  ResponsiveContainer, LineChart, Line, XAxis, Tooltip, Area, AreaChart,
} from "recharts";
import { format, subDays } from "date-fns";
import { Smile, Zap, Flame, Brain } from "lucide-react";
import Card from "../components/Card";
import NavBar from "../components/NavBar";
import { useCheckInStore } from "../lib/store";

const METRICS = [
  { key: "mood",       label: "Mood",        icon: Smile,  color: "#6366f1" },
  { key: "energy",     label: "Energy",      icon: Zap,    color: "#f59e0b" },
  { key: "stress",     label: "Stress",      icon: Flame,  color: "#ef4444" },
  { key: "mentalLoad", label: "Mental load", icon: Brain,  color: "#8b5cf6" },
];

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  show:   { opacity: 1, y: 0, transition: { type: "spring", stiffness: 280, damping: 22 } },
};

function AnimatedNumber({ value }: { value: string }) {
  return (
    <motion.p
      key={value}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-3xl font-bold text-primary-600"
    >
      {value}
    </motion.p>
  );
}

export default function Dashboard() {
  const { entries } = useCheckInStore();

  const last7 = useMemo(() =>
    Array.from({ length: 7 }, (_, i) => {
      const date = subDays(new Date(), 6 - i);
      const key  = format(date, "yyyy-MM-dd");
      const entry = entries.find((e) => e.date.startsWith(key));
      return {
        day:        format(date, "EEE"),
        mood:       entry?.mood       ?? null,
        energy:     entry?.energy     ?? null,
        stress:     entry?.stress     ?? null,
        mentalLoad: entry?.mentalLoad ?? null,
      };
    }), [entries]);

  const latest = entries[entries.length - 1];

  const radarData = latest
    ? METRICS.map(({ key, label }) => ({
        metric: label,
        value: latest[key as keyof typeof latest] as number,
      }))
    : [];

  const avg = (key: string) => {
    if (!entries.length) return "—";
    const vals = entries.map((e) => e[key as keyof typeof e] as number).filter(Boolean);
    return (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1);
  };

  return (
    <div className="min-h-screen bg-surface-muted pb-28 pt-6 md:pt-20 px-4 relative">
      {/* Ambient blobs */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-40 -left-20 w-96 h-96 rounded-full bg-primary-200/30 blur-3xl"
        />
      </div>

      <div className="max-w-md mx-auto space-y-4">
        <motion.h1
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-2xl font-bold text-gray-800"
        >
          My trends
        </motion.h1>

        {entries.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Card>
              <div className="py-10 text-center space-y-2">
                <Brain size={32} className="text-gray-200 mx-auto" />
                <p className="text-gray-400 text-sm">No data yet. Complete your first check-in.</p>
              </div>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
            initial="hidden"
            animate="show"
            className="space-y-4"
          >
            {/* Stat grid */}
            <div className="grid grid-cols-2 gap-3">
              {METRICS.map(({ key, label, icon: Icon, color }) => (
                <motion.div key={key} variants={itemVariants}>
                  <Card className="text-center space-y-1">
                    <div className="w-8 h-8 rounded-xl mx-auto flex items-center justify-center mb-2"
                      style={{ backgroundColor: color + "18" }}>
                      <Icon size={16} style={{ color }} />
                    </div>
                    <AnimatedNumber value={avg(key)} />
                    <p className="text-xs text-gray-400">{label}</p>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Area chart — mood trend */}
            <motion.div variants={itemVariants}>
              <Card>
                <p className="text-sm font-semibold text-gray-700 mb-4">Mood — last 7 days</p>
                <ResponsiveContainer width="100%" height={130}>
                  <AreaChart data={last7}>
                    <defs>
                      <linearGradient id="moodGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor="#6366f1" stopOpacity={0.25} />
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="day" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                    <Tooltip
                      contentStyle={{ borderRadius: 12, border: "none", fontSize: 12, boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}
                    />
                    <Area
                      type="monotone"
                      dataKey="mood"
                      stroke="#6366f1"
                      strokeWidth={2.5}
                      fill="url(#moodGrad)"
                      dot={{ r: 4, fill: "#6366f1", strokeWidth: 0 }}
                      activeDot={{ r: 6 }}
                      connectNulls={false}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </Card>
            </motion.div>

            {/* Multi-line chart */}
            <motion.div variants={itemVariants}>
              <Card>
                <p className="text-sm font-semibold text-gray-700 mb-4">All metrics — last 7 days</p>
                <ResponsiveContainer width="100%" height={140}>
                  <LineChart data={last7}>
                    <XAxis dataKey="day" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                    <Tooltip
                      contentStyle={{ borderRadius: 12, border: "none", fontSize: 12, boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}
                    />
                    {METRICS.map(({ key, color }) => (
                      <Line
                        key={key}
                        type="monotone"
                        dataKey={key}
                        stroke={color}
                        strokeWidth={2}
                        dot={false}
                        activeDot={{ r: 5 }}
                        connectNulls={false}
                      />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
                <div className="flex flex-wrap gap-3 mt-3">
                  {METRICS.map(({ key, label, color }) => (
                    <span key={key} className="flex items-center gap-1.5 text-xs text-gray-500">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
                      {label}
                    </span>
                  ))}
                </div>
              </Card>
            </motion.div>

            {/* Radar snapshot */}
            {radarData.length > 0 && (
              <motion.div variants={itemVariants}>
                <Card>
                  <p className="text-sm font-semibold text-gray-700 mb-2">Today's snapshot</p>
                  <ResponsiveContainer width="100%" height={200}>
                    <RadarChart data={radarData}>
                      <PolarGrid stroke="#e5e7eb" />
                      <PolarAngleAxis dataKey="metric" tick={{ fontSize: 11 }} />
                      <Radar
                        dataKey="value"
                        stroke="#6366f1"
                        fill="#6366f1"
                        fillOpacity={0.15}
                        strokeWidth={2}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </Card>
              </motion.div>
            )}
          </motion.div>
        )}
      </div>
      <NavBar />
    </div>
  );
}

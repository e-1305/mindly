import { useState } from "react";
import { motion } from "framer-motion";
import {
  Smile, Zap, Flame, Brain,
  HeartHandshake,
} from "lucide-react";
import { LucideIcon } from "lucide-react";
import MoodSlider, { MoodOption } from "../components/MoodSlider";
import Card from "../components/Card";
import NavBar from "../components/NavBar";
import { useAuthStore, useCheckInStore } from "../lib/store";
import { submitCheckIn } from "../lib/api";
import { format } from "date-fns";

type Scores = { mood: number; energy: number; stress: number; mentalLoad: number };

interface Question {
  key: keyof Scores;
  label: string;
  sublabel: string;
  icon: LucideIcon;
  options: MoodOption[];
}

const QUESTIONS: Question[] = [
  {
    key: "mood",
    label: "Overall feeling",
    sublabel: "How are you doing right now?",
    icon: Smile,
    options: [
      { label: "Rough",    color: "#ef4444", bg: "#fef2f2" },
      { label: "Low",      color: "#f97316", bg: "#fff7ed" },
      { label: "Neutral",  color: "#eab308", bg: "#fefce8" },
      { label: "Good",     color: "#84cc16", bg: "#f7fee7" },
      { label: "Thriving", color: "#22c55e", bg: "#f0fdf4" },
    ],
  },
  {
    key: "energy",
    label: "Energy level",
    sublabel: "How much fuel do you have?",
    icon: Zap,
    options: [
      { label: "Drained",  color: "#ef4444", bg: "#fef2f2" },
      { label: "Tired",    color: "#f97316", bg: "#fff7ed" },
      { label: "Moderate", color: "#eab308", bg: "#fefce8" },
      { label: "Active",   color: "#84cc16", bg: "#f7fee7" },
      { label: "Charged",  color: "#22c55e", bg: "#f0fdf4" },
    ],
  },
  {
    key: "stress",
    label: "Stress level",
    sublabel: "How much pressure do you feel?",
    icon: Flame,
    options: [
      { label: "Calm",     color: "#22c55e", bg: "#f0fdf4" },
      { label: "Mild",     color: "#84cc16", bg: "#f7fee7" },
      { label: "Moderate", color: "#eab308", bg: "#fefce8" },
      { label: "High",     color: "#f97316", bg: "#fff7ed" },
      { label: "Intense",  color: "#ef4444", bg: "#fef2f2" },
    ],
  },
  {
    key: "mentalLoad",
    label: "Mental load",
    sublabel: "How full is your head right now?",
    icon: Brain,
    options: [
      { label: "Clear",    color: "#22c55e", bg: "#f0fdf4" },
      { label: "Light",    color: "#84cc16", bg: "#f7fee7" },
      { label: "Busy",     color: "#eab308", bg: "#fefce8" },
      { label: "Heavy",    color: "#f97316", bg: "#fff7ed" },
      { label: "Overload", color: "#ef4444", bg: "#fef2f2" },
    ],
  },
];

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show:   { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
};

export default function CheckIn() {
  const { user } = useAuthStore();
  const { addEntry } = useCheckInStore();
  const [scores, setScores] = useState<Scores>({ mood: 3, energy: 3, stress: 3, mentalLoad: 3 });
  const [note, setNote] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await submitCheckIn({ ...scores, note });
    } catch { /* offline-first */ }
    addEntry({
      id: crypto.randomUUID(),
      userId: user!.id,
      date: new Date().toISOString(),
      ...scores,
      note,
    });
    setSubmitted(true);
    setLoading(false);
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-surface-muted">
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="text-center space-y-5"
        >
          <motion.div
            animate={{ rotate: [0, -10, 10, -6, 6, 0] }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto"
          >
            <HeartHandshake size={40} className="text-green-500" />
          </motion.div>
          <h2 className="text-2xl font-bold text-gray-800">Check-in recorded</h2>
          <p className="text-gray-500 text-sm max-w-xs">Your response has been saved. Thank you for checking in.</p>
          <p className="text-xs text-gray-400">{format(new Date(), "EEEE, MMMM d")}</p>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => {
              setSubmitted(false);
              setScores({ mood: 3, energy: 3, stress: 3, mentalLoad: 3 });
              setNote("");
            }}
            className="mt-2 text-sm text-primary-500 underline underline-offset-2"
          >
            Submit another (demo)
          </motion.button>
        </motion.div>
        <NavBar />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-muted pb-28 pt-6 md:pt-20 px-4">
      {/* Ambient background blob */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <motion.div
          animate={{ scale: [1, 1.08, 1], opacity: [0.4, 0.6, 0.4] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-primary-200/40 blur-3xl"
        />
        <motion.div
          animate={{ scale: [1, 1.05, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-violet-200/30 blur-3xl"
        />
      </div>

      <div className="max-w-md mx-auto space-y-4">
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-2"
        >
          <p className="text-xs text-gray-400 uppercase tracking-widest">{format(new Date(), "EEEE, MMMM d")}</p>
          <h1 className="text-2xl font-bold text-gray-800 mt-1">
            Hey {user?.name.split(" ")[0]}, how are you?
          </h1>
          <p className="text-sm text-gray-400 mt-1">Takes less than 30 seconds.</p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="space-y-3"
        >
          {QUESTIONS.map((q) => (
            <motion.div key={q.key} variants={itemVariants}>
              <Card className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-primary-50 flex items-center justify-center shrink-0">
                    <q.icon size={18} className="text-primary-500" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 text-sm leading-tight">{q.label}</p>
                    <p className="text-xs text-gray-400">{q.sublabel}</p>
                  </div>
                </div>
                <MoodSlider
                  value={scores[q.key]}
                  onChange={(v) => setScores((s) => ({ ...s, [q.key]: v }))}
                  icon={q.icon}
                  options={q.options}
                />
              </Card>
            </motion.div>
          ))}

          <motion.div variants={itemVariants}>
            <Card>
              <p className="text-sm font-medium text-gray-600 mb-2">
                Anything to add?{" "}
                <span className="text-gray-300 font-normal">optional</span>
              </p>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="A thought, a context, anything…"
                rows={3}
                className="w-full text-sm text-gray-700 placeholder-gray-300 resize-none focus:outline-none leading-relaxed"
              />
            </Card>
          </motion.div>
        </motion.div>

        <motion.button
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleSubmit}
          disabled={loading}
          className="w-full py-4 bg-primary-600 text-white rounded-3xl font-semibold text-base hover:bg-primary-700 transition-colors shadow-glow disabled:opacity-50 relative overflow-hidden"
        >
          {loading ? (
            <motion.span
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              Saving…
            </motion.span>
          ) : (
            "Submit my check-in"
          )}
        </motion.button>
      </div>
      <NavBar />
    </div>
  );
}

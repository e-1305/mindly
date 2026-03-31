import { motion } from "framer-motion";
import clsx from "clsx";
import { LucideIcon } from "lucide-react";

export interface MoodOption {
  label: string;
  color: string;
  bg: string;
}

const DEFAULT_OPTIONS: MoodOption[] = [
  { label: "Very low", color: "#ef4444", bg: "#fef2f2" },
  { label: "Low",      color: "#f97316", bg: "#fff7ed" },
  { label: "Okay",     color: "#eab308", bg: "#fefce8" },
  { label: "Good",     color: "#84cc16", bg: "#f7fee7" },
  { label: "Great",    color: "#22c55e", bg: "#f0fdf4" },
];

interface Props {
  value: number;
  onChange: (v: number) => void;
  icon: LucideIcon;
  options?: MoodOption[];
}

export default function MoodSlider({ value, onChange, icon: Icon, options = DEFAULT_OPTIONS }: Props) {
  return (
    <div className="flex gap-2">
      {options.map((opt, i) => {
        const v = i + 1;
        const active = value === v;
        return (
          <motion.button
            key={v}
            onClick={() => onChange(v)}
            whileTap={{ scale: 0.88 }}
            animate={active ? { scale: 1.08, y: -2 } : { scale: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            className={clsx(
              "flex-1 flex flex-col items-center gap-1.5 py-3 rounded-2xl border-2 transition-colors duration-150",
              active ? "border-transparent shadow-lg" : "border-gray-100 bg-white hover:border-gray-200"
            )}
            style={active ? { backgroundColor: opt.bg, borderColor: opt.color } : {}}
            aria-label={opt.label}
            aria-pressed={active}
          >
            <motion.div
              animate={active ? { color: opt.color } : { color: "#d1d5db" }}
              transition={{ duration: 0.15 }}
            >
              <Icon size={18} strokeWidth={active ? 2.5 : 1.8} />
            </motion.div>
            <span
              className="text-[10px] font-semibold leading-none"
              style={{ color: active ? opt.color : "#9ca3af" }}
            >
              {v}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}

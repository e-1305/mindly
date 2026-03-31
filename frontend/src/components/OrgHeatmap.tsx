import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { OrgMember, ORG, wellbeingScore, scoreToColor, scoreToLabel, GROUPS, groupAvgScore } from "../lib/orgData";
import Avatar from "./Avatar";

interface NodeProps {
  member: OrgMember;
  x: number;
  y: number;
  onClick: (m: OrgMember) => void;
  selected: boolean;
}

function OrgNode({ member, x, y, onClick, selected }: NodeProps) {
  const score = wellbeingScore(member);
  const color = scoreToColor(score);
  const size = member.role === "hr" ? 52 : member.role === "manager" ? 44 : member.role === "lead" ? 38 : 32;

  return (
    <motion.g
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.05 }}
      style={{ cursor: "pointer" }}
      onClick={() => onClick(member)}
    >
      {/* Glow ring */}
      <circle
        cx={x} cy={y} r={size / 2 + 5}
        fill={color + "22"}
        stroke={color}
        strokeWidth={selected ? 2.5 : 1.5}
      />
      {/* Pulse for at-risk */}
      {score < 2.6 && (
        <motion.circle
          cx={x} cy={y} r={size / 2 + 8}
          fill="none"
          stroke={color}
          strokeWidth={1}
          animate={{ r: [size / 2 + 8, size / 2 + 16], opacity: [0.6, 0] }}
          transition={{ duration: 1.8, repeat: Infinity }}
        />
      )}
      {/* Avatar circle */}
      <foreignObject x={x - size / 2} y={y - size / 2} width={size} height={size}>
        <div style={{ width: size, height: size }}>
          <Avatar config={member.avatar} size={size} />
        </div>
      </foreignObject>
      {/* Name label */}
      <text
        x={x} y={y + size / 2 + 14}
        textAnchor="middle"
        fontSize={9}
        fill="#6b7280"
        fontFamily="Inter, sans-serif"
        fontWeight={selected ? "700" : "500"}
      >
        {member.name.split(" ")[0]}
      </text>
    </motion.g>
  );
}

// Layout positions — manual tree layout
const POSITIONS: Record<string, { x: number; y: number }> = {
  "hr-1":   { x: 400, y: 50  },
  // Engineering branch
  "mgr-1":  { x: 160, y: 160 },
  "lead-1": { x: 160, y: 270 },
  "emp-1":  { x: 60,  y: 380 },
  "emp-2":  { x: 160, y: 380 },
  "emp-3":  { x: 260, y: 380 },
  // Product branch
  "mgr-2":  { x: 400, y: 160 },
  "lead-2": { x: 400, y: 270 },
  "emp-4":  { x: 340, y: 380 },
  "emp-5":  { x: 460, y: 380 },
  // Design branch
  "mgr-3":  { x: 640, y: 160 },
  "emp-6":  { x: 580, y: 270 },
  "emp-7":  { x: 700, y: 270 },
};

function getEdges() {
  return ORG.filter((m) => m.managerId).map((m) => ({
    from: POSITIONS[m.managerId!],
    to:   POSITIONS[m.id],
    score: wellbeingScore(m),
  }));
}

interface TooltipData {
  member: OrgMember;
  x: number;
  y: number;
}

export default function OrgHeatmap() {
  const [selected, setSelected] = useState<OrgMember | null>(null);
  const edges = getEdges();

  return (
    <div className="relative w-full">
      {/* Legend */}
      <div className="flex flex-wrap gap-3 mb-4 px-1">
        {[
          { label: "Thriving", color: "#22c55e" },
          { label: "Good",     color: "#84cc16" },
          { label: "Neutral",  color: "#facc15" },
          { label: "Low",      color: "#f97316" },
          { label: "Critical", color: "#ef4444" },
        ].map(({ label, color }) => (
          <div key={label} className="flex items-center gap-1.5 text-xs text-gray-500">
            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
            {label}
          </div>
        ))}
      </div>

      {/* Group labels */}
      <div className="flex justify-around mb-1 px-4">
        {GROUPS.map((g) => {
          const score = groupAvgScore(g.id);
          const color = scoreToColor(score);
          return (
            <div key={g.id} className="flex flex-col items-center gap-1">
              <span className="text-xs font-semibold" style={{ color: g.color }}>{g.label}</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: color + "20", color }}>
                {scoreToLabel(score)}
              </span>
            </div>
          );
        })}
      </div>

      {/* SVG graph */}
      <div className="overflow-x-auto">
        <svg width="800" height="440" viewBox="0 0 800 440" className="w-full max-w-full">
          {/* Edges */}
          {edges.map((e, i) => (
            <motion.line
              key={i}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ delay: 0.1 + i * 0.03, duration: 0.4 }}
              x1={e.from.x} y1={e.from.y}
              x2={e.to.x}   y2={e.to.y}
              stroke={scoreToColor(e.score)}
              strokeWidth={1.5}
              strokeOpacity={0.35}
              strokeDasharray="4 3"
            />
          ))}

          {/* Nodes */}
          {ORG.map((m) => (
            <OrgNode
              key={m.id}
              member={m}
              x={POSITIONS[m.id].x}
              y={POSITIONS[m.id].y}
              onClick={(m) => setSelected(selected?.id === m.id ? null : m)}
              selected={selected?.id === m.id}
            />
          ))}
        </svg>
      </div>

      {/* Detail tooltip */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            className="mt-3 bg-white rounded-3xl shadow-card p-4 border border-gray-100"
          >
            <div className="flex items-center gap-3 mb-3">
              <Avatar config={selected.avatar} size={44} wellbeing={wellbeingScore(selected)} />
              <div>
                <p className="font-semibold text-gray-800">{selected.name}</p>
                <p className="text-xs text-gray-400 capitalize">{selected.role} · {selected.streak} day streak</p>
              </div>
              <span
                className="ml-auto text-xs font-semibold px-3 py-1 rounded-full"
                style={{
                  backgroundColor: scoreToColor(wellbeingScore(selected)) + "20",
                  color: scoreToColor(wellbeingScore(selected)),
                }}
              >
                {scoreToLabel(wellbeingScore(selected))}
              </span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[
                { label: "Mood",    val: selected.mood,       good: true  },
                { label: "Energy",  val: selected.energy,     good: true  },
                { label: "Stress",  val: selected.stress,     good: false },
                { label: "Load",    val: selected.mentalLoad, good: false },
              ].map(({ label, val, good }) => {
                const color = good
                  ? val >= 4 ? "#22c55e" : val === 3 ? "#f59e0b" : "#ef4444"
                  : val >= 4 ? "#ef4444" : val === 3 ? "#f59e0b" : "#22c55e";
                return (
                  <div key={label} className="text-center rounded-2xl py-2" style={{ backgroundColor: color + "15" }}>
                    <p className="text-sm font-bold" style={{ color }}>{val}/5</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">{label}</p>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

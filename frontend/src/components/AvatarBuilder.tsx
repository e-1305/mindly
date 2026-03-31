import { motion } from "framer-motion";
import { Check } from "lucide-react";
import {
  AvatarConfig,
  SKIN_TONES, HAIR_COLORS, EYE_COLORS, BG_COLORS,
  HairStyle, EyeStyle, MouthStyle, GlassesStyle,
} from "../lib/avatarTypes";
import Avatar from "./Avatar";

interface Props {
  config: AvatarConfig;
  onChange: (cfg: AvatarConfig) => void;
}

function set<K extends keyof AvatarConfig>(
  cfg: AvatarConfig,
  key: K,
  val: AvatarConfig[K],
  onChange: (c: AvatarConfig) => void
) {
  onChange({ ...cfg, [key]: val });
}

// ── Swatch row ───────────────────────────────────────────────
function Swatches({ colors, value, onChange }: { colors: string[]; value: string; onChange: (c: string) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {colors.map((c) => (
        <motion.button
          key={c}
          onClick={() => onChange(c)}
          whileTap={{ scale: 0.82 }}
          className="w-8 h-8 rounded-full flex items-center justify-center"
          style={{
            backgroundColor: c,
            boxShadow: value === c ? `0 0 0 2px white, 0 0 0 4px ${c}` : undefined,
          }}
        >
          {value === c && <Check size={12} color="white" strokeWidth={3} />}
        </motion.button>
      ))}
    </div>
  );
}

// ── Option pill row ──────────────────────────────────────────
function Pills<T extends string>({
  options, value, onChange, accent,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
  accent?: string;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => (
        <motion.button
          key={o.value}
          onClick={() => onChange(o.value)}
          whileTap={{ scale: 0.9 }}
          className="px-3 py-1.5 rounded-xl text-xs font-semibold border-2 transition-colors"
          style={
            value === o.value
              ? { borderColor: accent ?? "#6366f1", backgroundColor: (accent ?? "#6366f1") + "18", color: accent ?? "#6366f1" }
              : { borderColor: "#e5e7eb", backgroundColor: "white", color: "#9ca3af" }
          }
        >
          {o.label}
        </motion.button>
      ))}
    </div>
  );
}

// ── Section label ────────────────────────────────────────────
function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{label}</p>
      {children}
    </div>
  );
}

const HAIR_OPTIONS: { value: HairStyle; label: string }[] = [
  { value: "none",   label: "Bald"    },
  { value: "short",  label: "Short"   },
  { value: "long",   label: "Long"    },
  { value: "curly",  label: "Curly"   },
  { value: "bun",    label: "Bun"     },
  { value: "mohawk", label: "Mohawk"  },
];

const EYE_OPTIONS: { value: EyeStyle; label: string }[] = [
  { value: "normal",  label: "Normal"  },
  { value: "happy",   label: "Happy"   },
  { value: "sleepy",  label: "Sleepy"  },
  { value: "star",    label: "Star ★"  },
  { value: "heart",   label: "Heart ♥" },
];

const MOUTH_OPTIONS: { value: MouthStyle; label: string }[] = [
  { value: "smile",     label: "Smile"     },
  { value: "grin",      label: "Grin"      },
  { value: "neutral",   label: "Neutral"   },
  { value: "surprised", label: "Surprised" },
  { value: "cool",      label: "Cool"      },
];

const GLASSES_OPTIONS: { value: GlassesStyle; label: string }[] = [
  { value: "none",   label: "None"   },
  { value: "round",  label: "Round"  },
  { value: "square", label: "Square" },
  { value: "cat",    label: "Cat"    },
];

export default function AvatarBuilder({ config, onChange }: Props) {
  const c = config;
  const ch = <K extends keyof AvatarConfig>(key: K, val: AvatarConfig[K]) => set(c, key, val, onChange);

  return (
    <div className="space-y-5">
      {/* Live preview */}
      <div className="flex justify-center py-2">
        <motion.div
          key={JSON.stringify(config)}
          initial={{ scale: 0.85, opacity: 0, rotate: -4 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 320, damping: 18 }}
          className="drop-shadow-xl"
        >
          <Avatar config={config} size={110} />
        </motion.div>
      </div>

      {/* Background */}
      <Section label="Background">
        <Swatches colors={BG_COLORS} value={c.bgColor} onChange={(v) => ch("bgColor", v)} />
      </Section>

      {/* Skin */}
      <Section label="Skin tone">
        <Swatches colors={SKIN_TONES} value={c.skinTone} onChange={(v) => ch("skinTone", v)} />
      </Section>

      {/* Hair style */}
      <Section label="Hair style">
        <Pills options={HAIR_OPTIONS} value={c.hairStyle} onChange={(v) => ch("hairStyle", v)} accent={c.hairColor} />
      </Section>

      {/* Hair color */}
      {c.hairStyle !== "none" && (
        <Section label="Hair color">
          <Swatches colors={HAIR_COLORS} value={c.hairColor} onChange={(v) => ch("hairColor", v)} />
        </Section>
      )}

      {/* Eyes */}
      <Section label="Eyes">
        <Pills options={EYE_OPTIONS} value={c.eyeStyle} onChange={(v) => ch("eyeStyle", v)} />
      </Section>

      {/* Eye color */}
      {(c.eyeStyle === "normal" || c.eyeStyle === "sleepy") && (
        <Section label="Eye color">
          <Swatches colors={EYE_COLORS} value={c.eyeColor} onChange={(v) => ch("eyeColor", v)} />
        </Section>
      )}

      {/* Mouth */}
      <Section label="Mouth">
        <Pills options={MOUTH_OPTIONS} value={c.mouthStyle} onChange={(v) => ch("mouthStyle", v)} />
      </Section>

      {/* Glasses */}
      <Section label="Glasses">
        <Pills options={GLASSES_OPTIONS} value={c.glasses} onChange={(v) => ch("glasses", v)} />
      </Section>
    </div>
  );
}

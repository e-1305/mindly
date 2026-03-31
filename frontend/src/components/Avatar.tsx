import { AvatarConfig, DEFAULT_AVATAR } from "../lib/avatarTypes";
import { scoreToColor } from "../lib/orgData";

interface Props {
  config?: Partial<AvatarConfig>;
  size?: number;
  wellbeing?: number;
  name?: string; // fallback initials if no config
}

// ── Hair paths (viewBox 100x100) ─────────────────────────────
function Hair({ style, color }: { style: string; color: string }) {
  switch (style) {
    case "short":
      return <path d="M22 42 Q22 14 50 14 Q78 14 78 42 Q72 28 50 28 Q28 28 22 42Z" fill={color} />;
    case "long":
      return <>
        <path d="M22 42 Q22 14 50 14 Q78 14 78 42 Q72 28 50 28 Q28 28 22 42Z" fill={color} />
        <rect x="18" y="40" width="8" height="32" rx="4" fill={color} />
        <rect x="74" y="40" width="8" height="32" rx="4" fill={color} />
      </>;
    case "curly":
      return <>
        <path d="M22 42 Q22 14 50 14 Q78 14 78 42 Q72 28 50 28 Q28 28 22 42Z" fill={color} />
        <circle cx="22" cy="38" r="7" fill={color} />
        <circle cx="30" cy="28" r="7" fill={color} />
        <circle cx="42" cy="20" r="7" fill={color} />
        <circle cx="58" cy="20" r="7" fill={color} />
        <circle cx="70" cy="28" r="7" fill={color} />
        <circle cx="78" cy="38" r="7" fill={color} />
      </>;
    case "bun":
      return <>
        <path d="M22 42 Q22 14 50 14 Q78 14 78 42 Q72 28 50 28 Q28 28 22 42Z" fill={color} />
        <circle cx="50" cy="14" r="10" fill={color} />
      </>;
    case "mohawk":
      return <>
        <rect x="44" y="4" width="12" height="28" rx="6" fill={color} />
        <path d="M30 44 Q30 20 50 20 Q70 20 70 44 Q64 32 50 32 Q36 32 30 44Z" fill={color} />
      </>;
    default: // none
      return null;
  }
}

// ── Eyes ─────────────────────────────────────────────────────
function Eyes({ style, color }: { style: string; color: string }) {
  switch (style) {
    case "happy":
      return <>
        <path d="M34 52 Q38 48 42 52" stroke={color} strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <path d="M58 52 Q62 48 66 52" stroke={color} strokeWidth="2.5" fill="none" strokeLinecap="round" />
      </>;
    case "sleepy":
      return <>
        <path d="M33 52 Q38 55 43 52" stroke={color} strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <path d="M57 52 Q62 55 67 52" stroke={color} strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <line x1="33" y1="50" x2="43" y2="50" stroke={color} strokeWidth="2" strokeLinecap="round" />
        <line x1="57" y1="50" x2="67" y2="50" stroke={color} strokeWidth="2" strokeLinecap="round" />
      </>;
    case "star":
      return <>
        <text x="34" y="56" fontSize="10" textAnchor="middle" fill={color}>★</text>
        <text x="66" y="56" fontSize="10" textAnchor="middle" fill={color}>★</text>
      </>;
    case "heart":
      return <>
        <text x="34" y="56" fontSize="10" textAnchor="middle" fill="#ef4444">♥</text>
        <text x="66" y="56" fontSize="10" textAnchor="middle" fill="#ef4444">♥</text>
      </>;
    default: // normal
      return <>
        <circle cx="38" cy="52" r="5" fill={color} />
        <circle cx="62" cy="52" r="5" fill={color} />
        <circle cx="40" cy="50" r="1.5" fill="white" />
        <circle cx="64" cy="50" r="1.5" fill="white" />
      </>;
  }
}

// ── Mouth ────────────────────────────────────────────────────
function Mouth({ style }: { style: string }) {
  switch (style) {
    case "grin":
      return <path d="M36 66 Q50 78 64 66" stroke="#1a1a1a" strokeWidth="2.5" fill="#ef9a9a" strokeLinecap="round" />;
    case "neutral":
      return <line x1="38" y1="68" x2="62" y2="68" stroke="#1a1a1a" strokeWidth="2.5" strokeLinecap="round" />;
    case "surprised":
      return <ellipse cx="50" cy="68" rx="7" ry="9" fill="#1a1a1a" />;
    case "cool":
      return <>
        <path d="M36 66 Q50 74 64 66" stroke="#1a1a1a" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <line x1="36" y1="66" x2="40" y2="66" stroke="#1a1a1a" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="60" y1="66" x2="64" y2="66" stroke="#1a1a1a" strokeWidth="2.5" strokeLinecap="round" />
      </>;
    default: // smile
      return <path d="M36 66 Q50 76 64 66" stroke="#1a1a1a" strokeWidth="2.5" fill="none" strokeLinecap="round" />;
  }
}

// ── Glasses ──────────────────────────────────────────────────
function Glasses({ style }: { style: string }) {
  if (style === "none") return null;
  const frameColor = "#1a1a1a";
  switch (style) {
    case "round":
      return <>
        <circle cx="38" cy="52" r="9" fill="none" stroke={frameColor} strokeWidth="2" />
        <circle cx="62" cy="52" r="9" fill="none" stroke={frameColor} strokeWidth="2" />
        <line x1="47" y1="52" x2="53" y2="52" stroke={frameColor} strokeWidth="2" />
        <line x1="29" y1="52" x2="24" y2="50" stroke={frameColor} strokeWidth="2" />
        <line x1="71" y1="52" x2="76" y2="50" stroke={frameColor} strokeWidth="2" />
      </>;
    case "square":
      return <>
        <rect x="29" y="44" width="18" height="14" rx="2" fill="none" stroke={frameColor} strokeWidth="2" />
        <rect x="53" y="44" width="18" height="14" rx="2" fill="none" stroke={frameColor} strokeWidth="2" />
        <line x1="47" y1="51" x2="53" y2="51" stroke={frameColor} strokeWidth="2" />
        <line x1="29" y1="51" x2="24" y2="50" stroke={frameColor} strokeWidth="2" />
        <line x1="71" y1="51" x2="76" y2="50" stroke={frameColor} strokeWidth="2" />
      </>;
    case "cat":
      return <>
        <path d="M29 56 L29 46 Q38 42 47 46 L47 56 Q38 58 29 56Z" fill="none" stroke={frameColor} strokeWidth="2" />
        <path d="M53 56 L53 46 Q62 42 71 46 L71 56 Q62 58 53 56Z" fill="none" stroke={frameColor} strokeWidth="2" />
        <line x1="47" y1="51" x2="53" y2="51" stroke={frameColor} strokeWidth="2" />
        <line x1="29" y1="51" x2="24" y2="50" stroke={frameColor} strokeWidth="2" />
        <line x1="71" y1="51" x2="76" y2="50" stroke={frameColor} strokeWidth="2" />
      </>;
    default: return null;
  }
}

export default function Avatar({ config, size = 40, wellbeing, name }: Props) {
  const cfg = { ...DEFAULT_AVATAR, ...config };
  const ringColor = wellbeing ? scoreToColor(wellbeing) : undefined;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      style={{
        borderRadius: "50%",
        flexShrink: 0,
        filter: ringColor ? `drop-shadow(0 0 4px ${ringColor})` : undefined,
        outline: ringColor ? `2.5px solid ${ringColor}` : undefined,
        outlineOffset: "2px",
      }}
    >
      {/* Background */}
      <circle cx="50" cy="50" r="50" fill={cfg.bgColor} />

      {/* Hair (behind face) */}
      <Hair style={cfg.hairStyle} color={cfg.hairColor} />

      {/* Face */}
      <ellipse cx="50" cy="55" rx="26" ry="28" fill={cfg.skinTone} />

      {/* Ears */}
      <ellipse cx="24" cy="55" rx="4" ry="5" fill={cfg.skinTone} />
      <ellipse cx="76" cy="55" rx="4" ry="5" fill={cfg.skinTone} />

      {/* Eyes */}
      <Eyes style={cfg.eyeStyle} color={cfg.eyeColor} />

      {/* Nose */}
      <ellipse cx="50" cy="61" rx="3" ry="2" fill={cfg.skinTone} style={{ filter: "brightness(0.88)" }} />

      {/* Mouth */}
      <Mouth style={cfg.mouthStyle} />

      {/* Glasses (on top) */}
      <Glasses style={cfg.glasses} />
    </svg>
  );
}

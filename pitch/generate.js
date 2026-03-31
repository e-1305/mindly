const PptxGenJS = require("pptxgenjs");
const pptx = new PptxGenJS();
pptx.layout = "LAYOUT_WIDE"; // 13.33 × 7.5

const BG     = "0A0A0F";
const WHITE  = "FFFFFF";
const DIM    = "4A4A6A";
const DIM2   = "2A2A4A";
const ACCENT = "6366F1";
const ACCENT2= "8B5CF6";
const GREEN  = "22C55E";
const RED    = "EF4444";
const YELLOW = "EAB308";
const ORANGE = "F97316";

function slide() {
  const s = pptx.addSlide();
  s.background = { color: BG };
  return s;
}

function label(s, text) {
  s.addText(text.toUpperCase(), {
    x: 0.7, y: 0.52, w: 12, h: 0.28,
    fontSize: 8, bold: true, color: ACCENT, charSpacing: 4,
  });
}

function rule(s, y = 0.98) {
  s.addShape(pptx.ShapeType.rect, {
    x: 0.7, y, w: 0.4, h: 0.04,
    fill: { color: ACCENT }, line: { color: ACCENT },
  });
}

function h1(s, text, y = 1.1, size = 52) {
  s.addText(text, {
    x: 0.7, y, w: 11.9, h: 3.2,
    fontSize: size, bold: true, color: WHITE,
    lineSpacingMultiple: 1.1,
  });
}

function body(s, text, y, w = 11.9, size = 14) {
  s.addText(text, {
    x: 0.7, y, w, h: 2.5,
    fontSize: size, color: DIM, wrap: true,
    lineSpacingMultiple: 1.5,
  });
}

function footnote(s, text) {
  s.addText(text, {
    x: 0.7, y: 6.95, w: 11.9, h: 0.3,
    fontSize: 8, color: DIM, italic: true,
  });
}

function bigNum(s, value, x, y, color = ACCENT) {
  s.addText(value, {
    x, y, w: 4.5, h: 1.6,
    fontSize: 72, bold: true, color,
    align: "center",
  });
}

function statCard(s, value, label, x, y, color = ACCENT) {
  s.addShape(pptx.ShapeType.rect, {
    x, y, w: 0.04, h: 1.6,
    fill: { color, transparency: 40 },
    line: { color, transparency: 40 },
  });
  s.addText(value, {
    x: x + 0.2, y, w: 3.5, h: 0.9,
    fontSize: 42, bold: true, color,
  });
  s.addText(label, {
    x: x + 0.2, y: y + 0.9, w: 3.5, h: 0.65,
    fontSize: 11, color: DIM, wrap: true,
  });
}

// ═══════════════════════════════════════════════════════════════
// 1 — Title
// ═══════════════════════════════════════════════════════════════
{
  const s = slide();

  s.addText("mindly", {
    x: 0, y: 1.9, w: 13.33, h: 2.8,
    fontSize: 120, bold: true, color: WHITE,
    align: "center", charSpacing: -6,
  });

  s.addText("Making the invisible visible.", {
    x: 0, y: 4.9, w: 13.33, h: 0.7,
    fontSize: 18, color: DIM, align: "center",
  });

  s.addText("A daily mental check-in app for HR teams.", {
    x: 0, y: 5.6, w: 13.33, h: 0.5,
    fontSize: 13, color: DIM2, align: "center",
  });
}

// ═══════════════════════════════════════════════════════════════
// 2 — Problem
// ═══════════════════════════════════════════════════════════════
{
  const s = slide();
  label(s, "The problem"); rule(s);

  h1(s, "Stress, fatigue, and burnout\nare invisible until\nit's too late.", 1.1, 44);

  body(s,
    "In the workplace, a large part of emotional and mental distress remains hidden. " +
    "Stress, mental fatigue, overload, and loss of motivation do not appear immediately — " +
    "and both managers and teams often overestimate their ability to understand how others truly feel.",
    4.6, 11.9, 12);

  footnote(s, "This gap between perception and reality leads to communication issues, poor workload distribution, and in the most serious cases — burnout.");
}

// ═══════════════════════════════════════════════════════════════
// 3 — Insight (data)
// ═══════════════════════════════════════════════════════════════
{
  const s = slide();
  label(s, "The data"); rule(s);

  s.addText("The numbers\ndon't lie.", {
    x: 0.7, y: 1.1, w: 5.5, h: 1.8,
    fontSize: 44, bold: true, color: WHITE,
    lineSpacingMultiple: 1.1,
  });

  statCard(s, "76%",    "of employees actively\nhide their stress at work",          0.7, 3.2, RED);
  statCard(s, "€1,900", "lost per employee per year\nfrom presenteeism",             4.3, 3.2, ORANGE);
  statCard(s, "3–6 mo", "before burnout is detected\nby managers on average",        7.9, 3.2, YELLOW);
  statCard(s, "46%",    "accuracy — how well managers\nread their team's emotions",  11.5, 3.2, ACCENT);

  footnote(s, "Sources: WHO 2022 · Zaki et al., PNAS 2009 · APA 1986");
}

// ═══════════════════════════════════════════════════════════════
// 4 — Solution
// ═══════════════════════════════════════════════════════════════
{
  const s = slide();
  label(s, "The solution"); rule(s);

  h1(s, "One notification.\nFour questions.\nThirty seconds.", 1.1, 48);

  // Right side — the 4 questions as clean list
  const qs = [
    { icon: "😊", q: "How are you feeling overall?" },
    { icon: "⚡", q: "How is your energy level?"    },
    { icon: "🌡", q: "How stressed do you feel?"    },
    { icon: "🧠", q: "How heavy is your mental load?" },
  ];

  qs.forEach(({ icon, q }, i) => {
    const y = 1.3 + i * 1.1;
    s.addShape(pptx.ShapeType.rect, {
      x: 7.8, y: y + 0.35, w: 5.2, h: 0.04,
      fill: { color: DIM2 }, line: { color: DIM2 },
    });
    s.addText(icon, { x: 7.8, y, w: 0.7, h: 0.7, fontSize: 22, align: "center" });
    s.addText(q, { x: 8.6, y: y + 0.05, w: 4.4, h: 0.55, fontSize: 14, color: WHITE });
  });

  body(s,
    "Each employee receives one notification per day, at a time they choose. " +
    "The data is used to identify trends, reveal gaps between how a person feels " +
    "and how the team perceives them, and generate actionable insights.",
    5.5, 11.9, 12);
}

// ═══════════════════════════════════════════════════════════════
// 5 — Product
// ═══════════════════════════════════════════════════════════════
{
  const s = slide();
  label(s, "The product"); rule(s);

  s.addText("Three roles.\nOne truth.", {
    x: 0.7, y: 1.1, w: 11.9, h: 1.6,
    fontSize: 48, bold: true, color: WHITE,
    lineSpacingMultiple: 1.1,
  });

  const cols = [
    {
      role: "Employee",
      color: ACCENT,
      lines: [
        "Daily 30-second check-in",
        "Personal mood & energy trends",
        "Custom avatar · Full privacy",
      ],
    },
    {
      role: "Manager",
      color: ACCENT2,
      lines: [
        "Team wellbeing heatmap",
        "At-risk alerts with context",
        "AI advisor chat (RAG-powered)",
      ],
    },
    {
      role: "HR",
      color: GREEN,
      lines: [
        "Org-wide graph with emotion colors",
        "Group & department breakdown",
        "AI insights grounded in research",
      ],
    },
  ];

  cols.forEach(({ role, color, lines }, i) => {
    const x = 0.7 + i * 4.1;
    const y = 3.2;

    s.addShape(pptx.ShapeType.rect, {
      x, y, w: 3.7, h: 0.04,
      fill: { color }, line: { color },
    });
    s.addText(role.toUpperCase(), {
      x, y: y + 0.2, w: 3.7, h: 0.3,
      fontSize: 8, bold: true, color, charSpacing: 3,
    });
    lines.forEach((line, j) => {
      s.addText(line, {
        x, y: y + 0.7 + j * 0.62, w: 3.7, h: 0.5,
        fontSize: 13, color: j === 0 ? WHITE : DIM,
      });
    });
  });
}

// ═══════════════════════════════════════════════════════════════
// 6 — Science
// ═══════════════════════════════════════════════════════════════
{
  const s = slide();
  label(s, "Scientific foundation"); rule(s);

  s.addText("Built on\npeer-reviewed research.", {
    x: 0.7, y: 1.1, w: 11.9, h: 1.8,
    fontSize: 44, bold: true, color: WHITE,
    lineSpacingMultiple: 1.1,
  });

  // Paper 1
  s.addShape(pptx.ShapeType.rect, {
    x: 0.7, y: 3.3, w: 0.04, h: 2.4,
    fill: { color: ACCENT }, line: { color: ACCENT },
  });
  s.addText("Zaki et al. — PNAS 2009", {
    x: 1.0, y: 3.3, w: 5.5, h: 0.45,
    fontSize: 13, bold: true, color: WHITE,
  });
  s.addText(
    "Empathically accurate judgments depend on both shared sensorimotor representations " +
    "and explicit mental state attribution. Perceivers are only 46% accurate at inferring " +
    "others' emotional states — structured daily check-ins close this gap.",
    { x: 1.0, y: 3.8, w: 5.5, h: 1.8, fontSize: 11, color: DIM, wrap: true, lineSpacingMultiple: 1.5 }
  );

  // Paper 2
  s.addShape(pptx.ShapeType.rect, {
    x: 7.1, y: 3.3, w: 0.04, h: 2.4,
    fill: { color: ACCENT2 }, line: { color: ACCENT2 },
  });
  s.addText("Rehmatullah & Ickes — Methods", {
    x: 7.4, y: 3.3, w: 5.5, h: 0.45,
    fontSize: 13, bold: true, color: WHITE,
  });
  s.addText(
    "Behavior-proximal reporting — capturing how people feel close to the moment — " +
    "is significantly more accurate than retrospective surveys. " +
    "Daily check-ins operationalize this principle at scale.",
    { x: 7.4, y: 3.8, w: 5.5, h: 1.8, fontSize: 11, color: DIM, wrap: true, lineSpacingMultiple: 1.5 }
  );

  s.addText("The AI advisor embeds both papers as RAG context — every response is grounded in science, not generic AI.", {
    x: 0.7, y: 6.3, w: 11.9, h: 0.5,
    fontSize: 11, color: DIM, italic: true,
  });
}

// ═══════════════════════════════════════════════════════════════
// 7 — Market
// ═══════════════════════════════════════════════════════════════
{
  const s = slide();
  label(s, "Market opportunity"); rule(s);

  s.addText("A large market\nmoving fast.", {
    x: 0.7, y: 1.1, w: 6, h: 1.8,
    fontSize: 44, bold: true, color: WHITE,
    lineSpacingMultiple: 1.1,
  });

  // Big market number
  s.addText("$6.2B", {
    x: 7.5, y: 0.9, w: 5.5, h: 2.2,
    fontSize: 88, bold: true, color: ACCENT,
    align: "right",
  });
  s.addText("global employee wellness market", {
    x: 7.5, y: 3.0, w: 5.5, h: 0.4,
    fontSize: 11, color: DIM, align: "right",
  });

  const points = [
    { v: "77%",  l: "of HR leaders say mental health\nis their top priority",    c: ACCENT  },
    { v: "3×",   l: "average ROI on workplace\nmental health programs",          c: GREEN   },
    { v: "50–500", l: "employees — our primary\ntarget company size",            c: ACCENT2 },
  ];

  points.forEach(({ v, l, c }, i) => {
    statCard(s, v, l, 0.7 + i * 4.1, 3.8, c);
  });
}

// ═══════════════════════════════════════════════════════════════
// 8 — Close
// ═══════════════════════════════════════════════════════════════
{
  const s = slide();

  s.addText("mindly", {
    x: 0, y: 1.8, w: 13.33, h: 2.4,
    fontSize: 108, bold: true, color: WHITE,
    align: "center", charSpacing: -5,
  });

  s.addText("One check-in. Every day.\nThat's all it takes to start seeing what was always there.", {
    x: 1.5, y: 4.4, w: 10.33, h: 1.4,
    fontSize: 17, color: DIM, align: "center",
    lineSpacingMultiple: 1.6,
  });

  // 3 pillars
  ["Science-backed", "Privacy-first", "30 seconds/day"].forEach((text, i) => {
    const x = 2.5 + i * 2.9;
    s.addShape(pptx.ShapeType.rect, {
      x, y: 6.1, w: 2.4, h: 0.03,
      fill: { color: ACCENT, transparency: i === 1 ? 0 : 50 },
      line: { color: ACCENT, transparency: i === 1 ? 0 : 50 },
    });
    s.addText(text, {
      x, y: 6.2, w: 2.4, h: 0.35,
      fontSize: 11, color: DIM, align: "center",
    });
  });

  s.addText("hello@mindly.app", {
    x: 0, y: 7.0, w: 13.33, h: 0.3,
    fontSize: 10, color: DIM2, align: "center",
  });
}

pptx.writeFile({ fileName: "mindly-pitch-deck.pptx" }).then(() => {
  console.log("✓ mindly-pitch-deck.pptx — 8 slides");
});

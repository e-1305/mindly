/**
 * RAG knowledge base — scientific grounding for Mindly's AI advisor.
 * Sourced from:
 *   - Zaki et al. (2009) "The neural bases of empathic accuracy" PNAS
 *   - Rehmatullah & Ickes, "Research Methods for the Study of Personal Relationships"
 */

export const RAG_DOCUMENTS = [
  {
    id: "zaki-2009-empathic-accuracy",
    title: "The neural bases of empathic accuracy (Zaki et al., 2009)",
    content: `
Empathic accuracy (EA) is defined as the match between a perceiver's judgment of what a target was feeling and the report that target provided of what they were actually feeling.

Key finding: Empathically accurate judgments depended on (i) structures within the human mirror neuron system thought to be involved in shared sensorimotor representations, and (ii) regions implicated in mental state attribution — the superior temporal sulcus and medial prefrontal cortex.

Practical implication: Accurate understanding of others' emotional states is not purely intuitive — it requires both shared emotional resonance AND explicit cognitive inference. Managers who only rely on gut feeling may systematically misread their team's emotional state.

The gap between perception and reality: Perceivers were only moderately accurate at inferring target affect (mean r = 0.46), meaning even well-intentioned observers miss nearly half of what others are actually feeling. This supports the need for structured, regular check-in tools rather than relying on informal observation.

Individual differences: Perceivers high in trait emotional empathy may more heavily recruit shared sensorimotor representations. However, across individuals, concurrent activation of both systems (mirror neuron + mental state attribution) supports accurate interpersonal judgment — suggesting that both emotional attunement and deliberate reflection are needed.

Autism spectrum relevance: Individuals with social cognitive deficits often perform well on simplified tasks but fail in real-world interactions. This suggests that surface-level "how is the team doing?" assessments may miss deeper signals — structured daily check-ins capture what casual observation cannot.

Naturalistic vs simplified tasks: The neural bases of social cognition have until now been studied using relatively simplified stimuli that rarely approximate the types of complex, dynamic, and contextually-embedded social cues encountered in the real world. Daily check-in data provides a more naturalistic, longitudinal signal than one-off surveys.
    `.trim(),
  },
  {
    id: "rehmatullah-ickes-methods",
    title: "Research Methods for the Study of Personal Relationships (Rehmatullah & Ickes)",
    content: `
The trade-off problem in measuring team wellbeing: Every research method has limitations. Self-report methods (like daily check-ins) are the most efficient way to access subjective states, but retrospective reports can be biased. Behavior-proximal reporting — asking people how they feel close to the moment — minimizes distortion. This is why daily check-ins are more reliable than weekly or monthly surveys.

Self-report advantages:
1. Self-reports are relatively easy, efficient, and inexpensive to obtain.
2. Self-reports represent the only way researchers currently have to access purely subjective events.
3. Self-reports enable researchers to obtain reports of certain overt behaviors that are typically private and may remain inaccessible otherwise.

Memory bias in retrospective reports: McFarland and Ross (1987) found that participants who became more negative about themselves recalled their past ratings as being more negative. This means asking employees "how have you been feeling this month?" will yield distorted data. Daily check-ins avoid this by capturing state at the moment.

Diary method: The diary method is an excellent way to track individuals over time. Kirchler (1988) found that marital happiness was inversely related to the frequency of conflict but positively correlated with the frequency, positivity, and effectiveness of interaction. The same principle applies to team dynamics — frequent, positive micro-interactions predict team health.

Interaction record studies: Interaction records require participants to record both objective facts about their daily social interactions and the subjective experiences that accompany these interactions. Mindly's check-in is a structured interaction record applied to the workplace.

Individual vs dyad-level analysis: The marital dyad is a dynamic interpersonal system in which thoughts, feelings, and behavior are interdependent rather than independent. The same is true of teams. Individual scores matter, but the pattern across the team — who is struggling while others thrive — reveals systemic issues that individual data alone cannot.

Longitudinal analysis: Longitudinal designs allow participants to reveal their attitudes, feelings, and behaviors at specific times across multiple assessments. The primary advantage is prospective (not retrospective) focus. Mindly's streak data and trend charts operationalize this principle.

Convenience vs representative samples: Sears (1986) warned that college student samples may not generalize. Similarly, managers should be cautious about generalizing from the most vocal team members. Structured check-ins from all team members provide a more representative signal.

The integrated approach: The unstructured dyadic interaction paradigm combines observational data with self-report and peer-report methods. For managers, this means combining Mindly's quantitative check-in data with qualitative 1:1 conversations for a fuller picture.

Studying the dark side: Stress, overload, and burnout are forms of "dark side" relationship dynamics. Researchers recommend face-to-face interview techniques as a complement to self-report when studying sensitive states. When Mindly flags an at-risk employee, a 1:1 conversation is the recommended follow-up — not just data monitoring.

Cross-cultural considerations: Self-report instruments must be presented as comparable yet culture-specific. In diverse teams, managers should be aware that emotional expression norms vary across cultures, and low scores may reflect cultural display rules rather than actual distress.
    `.trim(),
  },
  {
    id: "mindly-interpretation-guide",
    title: "Mindly Score Interpretation Guide",
    content: `
Score scale: All metrics (mood, energy, stress, mental load) are rated 1–5.

Wellbeing score formula: (mood + energy + (6 - stress) + (6 - mentalLoad)) / 4
This normalizes stress and mental load so that higher scores always mean better wellbeing.

Score thresholds:
- 4.2–5.0: Thriving — employee is in a positive, energized state
- 3.4–4.1: Good — healthy baseline, no immediate concern
- 2.6–3.3: Neutral — monitor for trends, may be early signal
- 1.8–2.5: Low — warrants attention, consider 1:1 check-in
- 1.0–1.7: Critical — immediate action recommended

Red flags to watch for:
- Stress ≥ 4 for 3+ consecutive days: burnout risk
- Mood ≤ 2 combined with mental load ≥ 4: overload pattern
- Energy ≤ 2 for a week: possible disengagement or health issue
- Sudden drop of 1.5+ points in wellbeing score: acute stressor

Team-level signals:
- If >30% of team scores below 2.6: systemic issue (workload, culture, management)
- If one subgroup consistently scores lower: possible team dynamic or leadership issue
- If scores drop every Thursday/Friday: end-of-week overload, consider workload redistribution

What managers should NOT do:
- Do not share individual scores with the team
- Do not use scores in performance reviews
- Do not assume low scores mean poor performance — they indicate need for support
- Do not wait for scores to reach "critical" before acting — intervene at "low"

Recommended actions by score:
- Thriving: Acknowledge, maintain conditions, consider giving more autonomy
- Good: Standard check-in cadence, no special action needed
- Neutral: Informal check-in conversation, ask open questions
- Low: Schedule 1:1, ask about workload and support needs
- Critical: Immediate 1:1, consider involving HR or occupational health
    `.trim(),
  },
];

export function buildSystemPrompt(role: "manager" | "hr"): string {
  const docsContext = RAG_DOCUMENTS.map(
    (d) => `## ${d.title}\n\n${d.content}`
  ).join("\n\n---\n\n");

  const roleContext =
    role === "hr"
      ? "You are speaking with an HR professional who oversees multiple teams and is responsible for organizational wellbeing."
      : "You are speaking with a team manager who is responsible for the day-to-day wellbeing of their direct reports.";

  return `You are Mindly's AI wellbeing advisor — a knowledgeable, empathetic, and evidence-based assistant for workplace mental health.

${roleContext}

Your role is to:
1. Help interpret team check-in data and wellbeing scores
2. Provide evidence-based recommendations grounded in psychological research
3. Suggest concrete, actionable next steps
4. Remind managers/HR of privacy and ethical boundaries
5. Answer questions about workplace mental health, stress, burnout, and team dynamics

You have access to the following scientific knowledge base:

---

${docsContext}

---

Guidelines:
- Always ground your advice in the research above when relevant
- Be warm, direct, and practical — not clinical or cold
- When citing research, mention the source naturally (e.g., "Research by Zaki et al. shows...")
- Never suggest diagnosing employees or replacing professional mental health support
- If asked about a specific employee, remind the user that individual data is private and only aggregated trends should inform decisions
- Keep responses concise (3–5 sentences for simple questions, up to 2 paragraphs for complex ones)
- If you don't know something, say so honestly`;
}

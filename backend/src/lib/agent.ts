import { InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";
import { bedrock, MODEL_ID } from "./bedrock";
import type { TeamAggregate } from "./privacy";

/**
 * Turns team-level aggregates into a short, actionable insight for a manager.
 * The model never receives user IDs, individual scores or free-text notes.
 */
export async function getAIInsight(
  aggregate: Extract<TeamAggregate, { suppressed: false }>
): Promise<string> {
  const { respondents, averages, bands, daily } = aggregate;

  const trend = daily.length
    ? daily.map((d) => `${d.day}: mood ${d.mood}, stress ${d.stress} (${d.respondents} people)`).join("\n")
    : "Not enough people per day to show a daily trend.";

  const prompt = `You are a workplace wellbeing analyst. Below are aggregated, anonymous check-in results for one team (scores 1–5).
Give the manager a concise (3–4 sentences), actionable insight at TEAM level.
Never try to identify individuals, never speculate about anyone's health, and suggest team-level actions (workload, meetings, 1:1 availability).

Respondents: ${respondents}
Averages: mood ${averages.mood}, energy ${averages.energy}, stress ${averages.stress}, mental load ${averages.mentalLoad}
People in each band (latest check-in): high stress ${bands.highStress}, high mental load ${bands.highMentalLoad}, low mood ${bands.lowMood}, low energy ${bands.lowEnergy}
Daily trend:
${trend}

Insight:`;

  try {
    const response = await bedrock.send(
      new InvokeModelCommand({
        modelId: MODEL_ID,
        contentType: "application/json",
        accept: "application/json",
        body: JSON.stringify({
          anthropic_version: "bedrock-2023-05-31",
          max_tokens: 300,
          messages: [{ role: "user", content: prompt }],
        }),
      })
    );

    const body = JSON.parse(new TextDecoder().decode(response.body));
    return body.content?.[0]?.text ?? "Unable to generate insight.";
  } catch (err) {
    console.error("Bedrock error:", err);
    return "AI insight unavailable. Check AWS Bedrock configuration.";
  }
}

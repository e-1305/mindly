import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";

const bedrock = new BedrockRuntimeClient({ region: process.env.AWS_REGION ?? "eu-west-1" });

const MODEL_ID = process.env.BEDROCK_MODEL_ID ?? "anthropic.claude-3-haiku-20240307-v1:0";

/**
 * Strands-style agent: takes raw check-in entries and returns
 * a human-readable insight for the manager.
 *
 * Uses AWS Bedrock (Claude) as the LLM backbone.
 * Replace with @strands/agent SDK when available in your environment.
 */
export async function getAIInsight(entries: Record<string, any>[]): Promise<string> {
  if (!entries.length) return "No check-in data available yet.";

  // Aggregate per user
  const byUser: Record<string, { mood: number[]; energy: number[]; stress: number[]; mentalLoad: number[] }> = {};
  for (const e of entries) {
    if (!byUser[e.userId]) byUser[e.userId] = { mood: [], energy: [], stress: [], mentalLoad: [] };
    byUser[e.userId].mood.push(e.mood);
    byUser[e.userId].energy.push(e.energy);
    byUser[e.userId].stress.push(e.stress);
    byUser[e.userId].mentalLoad.push(e.mentalLoad);
  }

  const avg = (arr: number[]) => (arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(1);

  const summary = Object.entries(byUser)
    .map(([uid, v]) =>
      `User ${uid}: mood=${avg(v.mood)}, energy=${avg(v.energy)}, stress=${avg(v.stress)}, mentalLoad=${avg(v.mentalLoad)}`
    )
    .join("\n");

  const prompt = `You are a workplace wellbeing analyst. Based on the following anonymized team check-in averages from the past week, provide a concise (3-4 sentences) actionable insight for the HR manager. Focus on identifying at-risk patterns and concrete recommendations. Do not mention specific user IDs.

Data:
${summary}

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

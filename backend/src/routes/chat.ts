import { Router } from "express";
import { BedrockRuntimeClient, InvokeModelWithResponseStreamCommand } from "@aws-sdk/client-bedrock-runtime";
import { requireAuth, AuthUser } from "../lib/auth";
import { buildSystemPrompt } from "../lib/ragDocs";
import { z } from "zod";

const router = Router();

const bedrock = new BedrockRuntimeClient({
  region: process.env.AWS_REGION ?? "us-west-2",
});

const MODEL_ID = process.env.BEDROCK_MODEL_ID ?? "anthropic.claude-3-haiku-20240307-v1:0";

const MessageSchema = z.object({
  messages: z.array(
    z.object({
      role: z.enum(["user", "assistant"]),
      content: z.string().max(4000),
    })
  ).min(1).max(20),
});

router.post("/", requireAuth, async (req, res) => {
  const user = (req as any).user as AuthUser;

  if (user.role !== "manager" && user.role !== "hr") {
    res.status(403).json({ error: "Only managers and HR can access the advisor." });
    return;
  }

  const parsed = MessageSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }

  const { messages } = parsed.data;
  const systemPrompt = buildSystemPrompt(user.role as "manager" | "hr");

  // Set up SSE streaming
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.flushHeaders();

  try {
    const command = new InvokeModelWithResponseStreamCommand({
      modelId: MODEL_ID,
      contentType: "application/json",
      accept: "application/json",
      body: JSON.stringify({
        anthropic_version: "bedrock-2023-05-31",
        max_tokens: 1024,
        system: systemPrompt,
        messages,
      }),
    });

    const response = await bedrock.send(command);

    if (!response.body) {
      res.write(`data: ${JSON.stringify({ error: "No response stream" })}\n\n`);
      res.end();
      return;
    }

    for await (const chunk of response.body) {
      if (chunk.chunk?.bytes) {
        const decoded = JSON.parse(new TextDecoder().decode(chunk.chunk.bytes));
        if (decoded.type === "content_block_delta" && decoded.delta?.text) {
          res.write(`data: ${JSON.stringify({ text: decoded.delta.text })}\n\n`);
        }
        if (decoded.type === "message_stop") {
          res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
        }
      }
    }
  } catch (err) {
    console.error("Bedrock stream error:", err);
    res.write(`data: ${JSON.stringify({ error: "AI advisor unavailable. Check AWS Bedrock configuration." })}\n\n`);
  } finally {
    res.end();
  }
});

export default router;

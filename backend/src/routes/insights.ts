import { Router } from "express";
import { QueryCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";
import { db, TABLES } from "../lib/db";
import { requireAuth, JwtPayload } from "../lib/auth";
import { getAIInsight } from "../lib/agent";

const router = Router();

// Team aggregated view (manager only)
router.get("/team", requireAuth, async (req, res) => {
  const user = (req as any).user as JwtPayload;
  if (user.role !== "manager") {
    res.status(403).json({ error: "Forbidden" });
    return;
  }

  const result = await db.send(
    new QueryCommand({
      TableName: TABLES.CHECKINS,
      IndexName: "teamId-date-index",
      KeyConditionExpression: "teamId = :t",
      ExpressionAttributeValues: { ":t": user.teamId },
      ScanIndexForward: false,
      Limit: 100,
    })
  );

  res.json({ entries: result.Items ?? [] });
});

// AI-generated insight via Strands agent
router.get("/ai", requireAuth, async (req, res) => {
  const user = (req as any).user as JwtPayload;
  if (user.role !== "manager") {
    res.status(403).json({ error: "Forbidden" });
    return;
  }

  const result = await db.send(
    new QueryCommand({
      TableName: TABLES.CHECKINS,
      IndexName: "teamId-date-index",
      KeyConditionExpression: "teamId = :t",
      ExpressionAttributeValues: { ":t": user.teamId },
      ScanIndexForward: false,
      Limit: 50,
    })
  );

  const entries = result.Items ?? [];
  const insight = await getAIInsight(entries);
  res.json({ insight });
});

export default router;

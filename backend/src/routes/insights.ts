import { Router } from "express";
import { QueryCommand } from "@aws-sdk/lib-dynamodb";
import { db, TABLES } from "../lib/db";
import { requireAuth, JwtPayload } from "../lib/auth";
import { getAIInsight } from "../lib/agent";
import { aggregateTeam } from "../lib/privacy";

const router = Router();

async function teamEntries(teamId: string, limit: number) {
  const result = await db.send(
    new QueryCommand({
      TableName: TABLES.CHECKINS,
      IndexName: "teamId-date-index",
      KeyConditionExpression: "teamId = :t",
      ExpressionAttributeValues: { ":t": teamId },
      // Only the scores: no free-text notes ever leave the employee's own view.
      ProjectionExpression: "userId, #d, mood, energy, stress, mentalLoad",
      ExpressionAttributeNames: { "#d": "date" },
      ScanIndexForward: false,
      Limit: limit,
    })
  );
  return (result.Items ?? []) as any[];
}

// Team view (manager only): aggregates only, suppressed for small groups.
router.get("/team", requireAuth, async (req, res) => {
  const user = (req as any).user as JwtPayload;
  if (user.role !== "manager") {
    res.status(403).json({ error: "Forbidden" });
    return;
  }

  res.json(aggregateTeam(await teamEntries(user.teamId, 200)));
});

// AI-generated insight, computed from the same aggregates.
router.get("/ai", requireAuth, async (req, res) => {
  const user = (req as any).user as JwtPayload;
  if (user.role !== "manager") {
    res.status(403).json({ error: "Forbidden" });
    return;
  }

  const aggregate = aggregateTeam(await teamEntries(user.teamId, 100));
  if (aggregate.suppressed) {
    res.json({ insight: aggregate.reason });
    return;
  }

  res.json({ insight: await getAIInsight(aggregate) });
});

export default router;

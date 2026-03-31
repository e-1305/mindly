import { Router } from "express";
import { v4 as uuid } from "uuid";
import { PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { db, TABLES } from "../lib/db";
import { requireAuth, JwtPayload } from "../lib/auth";
import { z } from "zod";

const router = Router();

const CheckInSchema = z.object({
  mood:       z.number().int().min(1).max(5),
  energy:     z.number().int().min(1).max(5),
  stress:     z.number().int().min(1).max(5),
  mentalLoad: z.number().int().min(1).max(5),
  note:       z.string().max(500).optional(),
});

router.post("/", requireAuth, async (req, res) => {
  const user = (req as any).user as JwtPayload;
  const parsed = CheckInSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }

  const item = {
    id:         uuid(),
    userId:     user.userId,
    teamId:     user.teamId,
    date:       new Date().toISOString(),
    ...parsed.data,
  };

  await db.send(new PutCommand({ TableName: TABLES.CHECKINS, Item: item }));
  res.json({ success: true, id: item.id });
});

router.get("/me", requireAuth, async (req, res) => {
  const user = (req as any).user as JwtPayload;
  const result = await db.send(
    new QueryCommand({
      TableName: TABLES.CHECKINS,
      IndexName: "userId-date-index",
      KeyConditionExpression: "userId = :u",
      ExpressionAttributeValues: { ":u": user.userId },
      ScanIndexForward: false,
      Limit: 30,
    })
  );
  res.json({ entries: result.Items ?? [] });
});

export default router;

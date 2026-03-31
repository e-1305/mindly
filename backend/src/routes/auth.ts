import { Router } from "express";
import bcrypt from "bcryptjs";
import { v4 as uuid } from "uuid";
import { GetCommand, PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { db, TABLES } from "../lib/db";
import { signToken } from "../lib/auth";
import { z } from "zod";

const router = Router();

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

router.post("/login", async (req, res) => {
  const parsed = LoginSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }
  const { email, password } = parsed.data;

  try {
    const result = await db.send(
      new QueryCommand({
        TableName: TABLES.USERS,
        IndexName: "email-index",
        KeyConditionExpression: "email = :e",
        ExpressionAttributeValues: { ":e": email },
      })
    );

    const user = result.Items?.[0];
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    const token = signToken({ userId: user.id, role: user.role, teamId: user.teamId });
    res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role, teamId: user.teamId },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal error" });
  }
});

// Seed / register (dev only)
router.post("/register", async (req, res) => {
  const { name, email, password, role, teamId } = req.body;
  const id = uuid();
  const passwordHash = await bcrypt.hash(password, 10);
  await db.send(
    new PutCommand({
      TableName: TABLES.USERS,
      Item: { id, name, email, passwordHash, role: role ?? "employee", teamId: teamId ?? "team-1" },
    })
  );
  res.json({ id });
});

export default router;

import { Request, Response, NextFunction } from "express";
import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

// Initialize Firebase Admin once
if (!getApps().length) {
  // In production use a service account JSON; for hackathon we use project ID only
  // (works when running on GCP/Firebase infra or with GOOGLE_APPLICATION_CREDENTIALS set)
  // For local dev with AWS creds, we skip token verification and trust the client role claim.
  try {
    initializeApp({ projectId: process.env.FIREBASE_PROJECT_ID ?? "mindly-miro-hack" });
  } catch {
    // already initialized
  }
}

export interface AuthUser {
  userId: string;
  role: "employee" | "manager" | "hr";
  teamId: string;
  email: string;
}

export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const token = header.slice(7);

  // Demo token bypass for local dev — role comes from query param or defaults to manager
  if (token === "demo-token") {
    // Read role hint from a custom header set by the frontend
    const roleHint = (req.headers["x-demo-role"] as string) ?? "manager";
    const role = ["manager", "hr", "employee"].includes(roleHint) ? roleHint : "manager";
    (req as any).user = { userId: "demo", role, teamId: "team-1", email: "demo@mindly.app" };
    next();
    return;
  }

  try {
    const decoded = await getAuth().verifyIdToken(token);
    (req as any).user = {
      userId: decoded.uid,
      email:  decoded.email ?? "",
      role:   (decoded.role as "employee" | "manager") ?? "employee",
      teamId: (decoded.teamId as string) ?? "team-1",
    };
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
};

// Keep signToken for seed script compatibility
import jwt from "jsonwebtoken";
export interface JwtPayload { userId: string; role: "employee" | "manager" | "hr"; teamId: string; }
export const signToken = (payload: JwtPayload) =>
  jwt.sign(payload, process.env.JWT_SECRET ?? "mindly-dev-secret", { expiresIn: "7d" });

// Lambda entry point — wraps Express app for AWS Lambda
import serverlessExpress from "@codegenie/serverless-express";
import "dotenv/config";
import express from "express";
import cors from "cors";
import authRouter from "./routes/auth";
import checkinRouter from "./routes/checkin";
import insightsRouter from "./routes/insights";

const app = express();
app.use(cors());
app.use(express.json());
app.use("/auth", authRouter);
app.use("/checkin", checkinRouter);
app.use("/insights", insightsRouter);
app.get("/health", (_, res) => res.json({ status: "ok" }));

export const handler = serverlessExpress({ app });

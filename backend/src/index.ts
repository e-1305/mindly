import "dotenv/config";
import express from "express";
import cors from "cors";
import authRouter from "./routes/auth";
import checkinRouter from "./routes/checkin";
import insightsRouter from "./routes/insights";
import chatRouter from "./routes/chat";

const app = express();
app.use(cors({
  origin: "*",
  allowedHeaders: ["Content-Type", "Authorization", "x-demo-role"],
}));
app.use(express.json());

app.use("/auth", authRouter);
app.use("/checkin", checkinRouter);
app.use("/insights", insightsRouter);
app.use("/chat", chatRouter);

app.get("/health", (_, res) => res.json({ status: "ok" }));

const PORT = process.env.PORT ?? 3001;
app.listen(PORT, () => console.log(`Mindly API running on :${PORT}`));

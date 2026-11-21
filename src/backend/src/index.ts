import { DEMO_MODE } from "./config/env";
import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth";
import containerRoutes from "./routes/containers";
import userRoutes from "./routes/user";
import chatRoutes from "./routes/chat";
import { errorHandler } from "./middleware/errorHandler";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", demo: DEMO_MODE, timestamp: new Date().toISOString() });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/containers", containerRoutes);
app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);

// Error handler
app.use(errorHandler);

// Prevent unhandled errors from crashing the process
process.on("uncaughtException", (err) => {
  console.error("[uncaughtException]", err);
});
process.on("unhandledRejection", (err) => {
  console.error("[unhandledRejection]", err);
});

app.listen(PORT, () => {
  console.log(`AG7 API running on port ${PORT}${DEMO_MODE ? " (DEMO MODE: in-memory DB, simulated Docker, mock LLM)" : ""}`);
});

export default app;

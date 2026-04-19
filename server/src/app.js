import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import aiRoutes from "./routes/aiRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import calculationRoutes from "./routes/calculationRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import rateRoutes from "./routes/rateRoutes.js";
import { errorHandler, notFound } from "./middleware/errorHandler.js";

dotenv.config();

export const app = express();

const corsOrigin = process.env.CLIENT_URL
  ? process.env.CLIENT_URL.split(",").map((origin) => origin.trim()).filter(Boolean)
  : "*";

app.use(
  cors({
    origin: corsOrigin
  })
);
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json({ limit: "1mb" }));

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/auth", authRoutes);
app.use("/api/calculate", calculationRoutes);
app.use("/api/rates", rateRoutes);
app.use("/api/project", projectRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/admin", adminRoutes);

app.use(notFound);
app.use(errorHandler);

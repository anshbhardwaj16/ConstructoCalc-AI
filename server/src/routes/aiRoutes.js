import express from "express";
import {
  analyzeEstimate,
  chatWithAssistant,
  getChatSessions
} from "../controllers/aiController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.post("/analyze", analyzeEstimate);
router.get("/chat", protect, getChatSessions);
router.post("/chat", protect, chatWithAssistant);

export default router;

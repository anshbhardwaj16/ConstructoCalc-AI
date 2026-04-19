import { ChatSession } from "../models/ChatSession.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { askGroq, generateConstructionInsights } from "../services/groqService.js";

export const analyzeEstimate = asyncHandler(async (req, res) => {
  const insights = await generateConstructionInsights(req.body);
  res.json(insights);
});

export const chatWithAssistant = asyncHandler(async (req, res) => {
  const { prompt, sessionId, projectContext } = req.body;

  if (!prompt?.trim()) {
    return res.status(400).json({ message: "Prompt is required" });
  }

  let session = sessionId
    ? await ChatSession.findOne({ _id: sessionId, user: req.user._id })
    : null;

  if (!session) {
    session = await ChatSession.create({
      user: req.user._id,
      title: "Construction AI Chat",
      messages: []
    });
  }

  session.messages.push({ role: "user", content: prompt.trim() });

  const reply = await askGroq([
    {
      role: "system",
      content:
        "You are a civil engineering expert and construction planning assistant for Indian residential projects. Give practical, safe, concise answers."
    },
    ...(projectContext
      ? [{ role: "user", content: `Project context: ${JSON.stringify(projectContext)}` }]
      : []),
    ...session.messages.slice(-8).map((message) => ({
      role: message.role,
      content: message.content
    }))
  ]);

  session.messages.push({ role: "assistant", content: reply });
  await session.save();

  res.json({ session });
});

export const getChatSessions = asyncHandler(async (req, res) => {
  const sessions = await ChatSession.find({ user: req.user._id }).sort({ updatedAt: -1 });
  res.json(sessions);
});

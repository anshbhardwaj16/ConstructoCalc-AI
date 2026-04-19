import { ApiError } from "../utils/ApiError.js";

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";

const parseBullets = (content) =>
  content
    .split("\n")
    .map((line) => line.replace(/^[-*\d.\s]+/, "").trim())
    .filter(Boolean)
    .slice(0, 5);

export const askGroq = async (messages) => {
  const apiKey = process.env.GROQ_API_KEY?.trim();

  if (!apiKey) {
    throw new ApiError(500, "GROQ_API_KEY is not configured");
  }

  let response;

  try {
    response = await fetch(GROQ_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: process.env.GROQ_MODEL || "llama-3.3-70b-versatile",
        messages,
        temperature: 0.4
      })
    });
  } catch (error) {
    throw new ApiError(502, "Unable to reach Groq API", error.message);
  }

  if (!response.ok) {
    const errorText = await response.text();
    throw new ApiError(response.status, "Groq API request failed", errorText);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content?.trim() || "";
};

export const generateConstructionInsights = async (payload) => {
  const context = `
Plot size: ${payload.plotSize} sq ft
Floors: ${payload.floors}
City: ${payload.city}
Quality: ${payload.quality}
Total cost: INR ${payload.totalCost}
Material breakdown: ${JSON.stringify(payload.materialBreakdown)}
  `.trim();

  const [explanation, optimizationRaw, risksRaw] = await Promise.all([
    askGroq([
      { role: "system", content: "You are a civil engineering expert in India. Explain construction costs in simple terms." },
      { role: "user", content: `Explain this construction cost in simple terms:\n${context}` }
    ]),
    askGroq([
      { role: "system", content: "You are a civil engineering expert in India." },
      { role: "user", content: `Suggest 3 practical ways to reduce construction cost in India without compromising safety.\n${context}` }
    ]),
    askGroq([
      { role: "system", content: "You are a civil engineering expert in India." },
      { role: "user", content: `Identify potential risks or hidden costs in this construction estimate.\n${context}` }
    ])
  ]);

  return {
    explanation,
    optimization: parseBullets(optimizationRaw),
    risks: parseBullets(risksRaw)
  };
};

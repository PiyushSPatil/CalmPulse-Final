require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");
const { pipeline } = require("@xenova/transformers");

const app = express();
app.use(bodyParser.json());
app.use(cors());

// ==============================
// 🧠 Emotion Model
// ==============================
let emotionClassifier = null;

async function loadModels() {
  console.log("🔄 Loading emotion model...");

  emotionClassifier = await pipeline(
    "text-classification",
    "Xenova/distilbert-base-uncased-finetuned-sst-2-english"
  );

  console.log("✅ Emotion model loaded");
}

// ==============================
// 🎭 Personality Style (STRONG)
// ==============================
function getPersonalityStyle(personality) {
  if (personality === "guardian") {
    return `
You are a protective guardian.
- Make the user feel safe
- Speak calmly and reassuringly
- Use comforting phrases like "you're safe", "I'm here"
`;
  }

  if (personality === "mentor") {
    return `
You are a wise mentor.
- Give thoughtful advice
- Speak calmly and insightfully
- Help the user reflect and grow
`;
  }

  return `
You are a friendly best friend.
- Speak casually and warmly
- Be relatable and supportive
- Use natural human tone
`;
}

// ==============================
// 🧠 Prompt Builder (STRONG)
// ==============================
function buildPrompt(userInput, emotion, personality) {
  return `
${getPersonalityStyle(personality)}

User message: "${userInput}"
Detected emotion: ${emotion}

STRICT RULES:
- Always stay in character
- Be empathetic and human-like
- DO NOT repeat the user input
- Keep response 2–3 sentences
- Respond specifically to THIS situation (no generic replies)

Examples:

User: I feel anxious
Response: I understand how overwhelming that can feel 💙 You're not alone. Try taking a few slow breaths—I'm here with you.

User: I have exams tomorrow
Response: That can definitely feel stressful 💙 Just focus on doing your best—you’ve prepared more than you think.

Now respond:
`;
}

// ==============================
// 🤖 DeepSeek via OpenRouter
// ==============================
async function getAIResponse(prompt) {
  const response = await axios.post(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      model: "deepseek/deepseek-chat",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.9,
      top_p: 0.9,
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data.choices[0].message.content.trim();
}

// ==============================
// 🎯 FORCE PERSONALITY OUTPUT
// ==============================
function applyPersonalityTone(text, personality) {
  if (personality === "guardian") {
    return "You're safe here 💙 " + text;
  }

  if (personality === "mentor") {
    return text + " 🌿";
  }

  if (personality === "friendly") {
    return text + " 💙";
  }

  return text;
}

// ==============================
// 🚀 CHAT ROUTE
// ==============================
app.post("/chat", async (req, res) => {
  try {
    const { message, personality = "friendly" } = req.body;

    if (!message) {
      return res.status(400).json({ error: "No message provided" });
    }

    // 🧠 Emotion detection
    const emotionResult = await emotionClassifier(message);
    const emotion =
      emotionResult[0].label === "POSITIVE" ? "positive" : "negative";

    // 🧠 Build prompt
    const prompt = buildPrompt(message, emotion, personality);

    // 🤖 Get AI response
    let botReply = await getAIResponse(prompt);

    // 🚨 Fix bad responses (like repetition)
    if (
      !botReply ||
      botReply.length < 10 ||
      botReply.toLowerCase().includes(message.toLowerCase())
    ) {
      botReply = "I'm here for you 💙 Tell me what's on your mind.";
    }

    // 🎭 Apply personality styling
    botReply = applyPersonalityTone(botReply, personality);

    res.json({
      bot_reply: botReply,
      detected_emotion: emotion,
    });

    console.log("\n====================");
    console.log("USER:", message);
    console.log("PERSONALITY:", personality);
    console.log("EMOTION:", emotion);
    console.log("BOT:", botReply);
    console.log("====================\n");

  } catch (err) {
    console.error(err.response?.data || err.message);

    res.status(500).json({
      bot_reply: "I'm here for you 💙 Something went wrong, but you can try again.",
      detected_emotion: "unknown",
    });
  }
});

// ==============================
// 🚀 START SERVER
// ==============================
const PORT = 3000;

app.listen(PORT, async () => {
  await loadModels();
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
const express = require("express");
const bodyParser = require("body-parser");
const { pipeline } = require("@xenova/transformers");
const cors = require("cors");

const app = express();
app.use(bodyParser.json());
app.use(express.static("public"));
app.use(cors());

// --- Lazy initialization ---
let emotionClassifier = null;
let chatbot = null;

async function loadModels() {
  console.log("\n🔄 Loading models... (this may take a moment)\n");

  // Emotion detection
  emotionClassifier = await pipeline(
    "text-classification",
    "Xenova/distilbert-base-uncased-finetuned-sst-2-english",
  );

  // Chat model
  chatbot = await pipeline("text2text-generation", "Xenova/flan-t5-base");

  console.log("\n✅ Models loaded successfully!\n");
}

// 🧠 STRONG PROMPT (FIXED)
function buildPrompt(userInput, emotion, personality) {
  let role = "";

  if (personality === "friendly") {
    role = "You are a friendly best friend who speaks casually and warmly.";
  } 
  else if (personality === "guardian") {
    role = "You are a protective guardian who reassures the user and makes them feel safe.";
  } 
  else if (personality === "mentor") {
    role = "You are a wise mentor who gives thoughtful guidance and calm advice.";
  }

  return `
${role}

User message: ${userInput}
Detected emotion: ${emotion}

IMPORTANT RULES:
- Always respond in character
- Use tone matching your role
- Be empathetic
- Keep response short (1-2 sentences)
- Do NOT repeat the user input

Response:
`;
}

// 🧠 Detect bad responses
function isBadResponse(reply, userInput) {
  const r = reply.toLowerCase();
  const u = userInput.toLowerCase();

  return (
    !reply ||
    reply.length < 10 ||
    r.includes("i don't know") ||
    r.includes("not sure") ||
    r.includes(u) || // repeating input
    r.includes("be calm")
  );
}

// 🧠 Smart fallback responses (VERY IMPORTANT)
function smartFallback(userInput, personality) {
  const input = userInput.toLowerCase();

  // 🎭 Personality first
  if (personality === "guardian") {
    return "You're safe here 💙 Take your time. I'm here with you.";
  }

  if (personality === "mentor") {
    return "Take a moment to breathe 🌿 Sometimes clarity comes when we slow down.";
  }

  // 🧠 Context-based
  if (input.includes("hello") || input.includes("hi")) {
    return "Hey 😊 I'm here for you. How are you feeling today?";
  }

  if (input.includes("exam") || input.includes("test")) {
    return "Exams can feel stressful 💙 Take a deep breath—you’ve prepared more than you think.";
  }

  if (input.includes("stress") || input.includes("anxious")) {
    return "I understand how overwhelming that can feel 💙 You're not alone.";
  }

  if (input.includes("sad") || input.includes("low")) {
    return "I'm really sorry you're feeling this way 💙 Want to talk about it?";
  }

  return "I'm here for you 💙 Tell me what's been on your mind.";
}

// --- Routes ---
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

app.post("/chat", async (req, res) => {
  try {
    if (!emotionClassifier || !chatbot) {
      return res.status(500).json({ error: "Models not loaded yet." });
    }

    const userInput = req.body.message;
    const personality = req.body.personality || "friendly";

    if (!userInput) {
      return res.status(400).json({ error: "No input message provided." });
    }

    // 🔍 Emotion detection
    const emotionResult = await emotionClassifier(userInput);
    const emotion = emotionResult[0].label;

    // 🧠 Prompt
    const prompt = buildPrompt(userInput, emotion,personality);

    // 🤖 Model response
    const response = await chatbot(prompt, {
      max_new_tokens: 80,
    });

    let botReply = response[0].generated_text.trim();

    // 🚨 Fix bad responses
    if (isBadResponse(botReply, userInput)) {
      botReply = smartFallback(userInput, personality);
    }

    res.json({
      user_input: userInput,
      detected_emotion: emotion,
      bot_reply: botReply,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong." });
  }
});

// --- Start server ---
const PORT = 3000;
app.listen(PORT, async () => {
  await loadModels();
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});

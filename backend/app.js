const express = require("express");
const bodyParser = require("body-parser");
const { pipeline } = require("@xenova/transformers");
const cors = require("cors");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { MongoClient } = require('mongodb');

const app = express();
app.use(bodyParser.json());
app.use(express.static("public"));
app.use(cors());

// Accept both direct and proxied frontend requests by stripping /api if it is present.
app.use((req, res, next) => {
  if (req.path.startsWith('/api/')) {
    req.url = req.url.replace(/^\/api/, '');
  }
  next();
});

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017';
const DB_NAME = process.env.DB_NAME || 'calmpulse';
const COUNSELOR_EMAIL = 'counselor@calmpulse.com';
const COUNSELOR_NAME = 'Counselor';
const COUNSELOR_PASSWORD = 'Counselor123';
const COUNSELOR_ROLE = 'counselor';
let usersCollection;
let chatsCollection;
let screeningsCollection;

async function connectDb() {
  const client = new MongoClient(MONGO_URI);
  await client.connect();
  const db = client.db(DB_NAME);
  usersCollection = db.collection('users');
  chatsCollection = db.collection('chats');
  screeningsCollection = db.collection('screenings');
  await usersCollection.createIndex({ email: 1 }, { unique: true });
  await chatsCollection.createIndex({ userEmail: 1 });
  await screeningsCollection.createIndex({ userEmail: 1 });
  console.log(`Connected to MongoDB at ${MONGO_URI}, using database "${DB_NAME}"`);
}

async function getUserByEmail(email) {
  return usersCollection && (await usersCollection.findOne({ email }));
}

async function createUser(user) {
  return await usersCollection.insertOne(user);
}

async function saveChatLog(log) {
  if (!chatsCollection) return null;
  return await chatsCollection.insertOne(log);
}

async function saveScreeningResult(result) {
  if (!screeningsCollection) return null;
  return await screeningsCollection.insertOne(result);
}

async function getScreeningsByEmail(email) {
  if (!screeningsCollection) return [];
  return await screeningsCollection.find({ userEmail: email }).sort({ createdAt: -1 }).toArray();
}

async function getAllScreenings() {
  if (!screeningsCollection) return [];
  return await screeningsCollection.find().sort({ createdAt: -1 }).toArray();
}

// Auth middleware
function authenticate(req, res, next) {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'No token' });
  try {
    req.user = jwt.verify(token, 'secret');
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
}

// Auth routes
const registerHandler = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ error: 'All fields required' });
  if (email === COUNSELOR_EMAIL) return res.status(400).json({ error: 'Counselor must use the counselor login portal' });

  const existingUser = await getUserByEmail(email);
  if (existingUser) return res.status(400).json({ error: 'User exists' });

  const hashed = await bcrypt.hash(password, 10);
  const role = 'student';

  try {
    await createUser({ name, email, password: hashed, role });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: 'User exists' });
    }
    console.error('Error saving user:', error);
    return res.status(500).json({ error: 'Unable to register user' });
  }

  const token = jwt.sign({ email, role }, 'secret', { expiresIn: '1h' });
  res.json({ token, user: { name, email, role } });
};

const loginHandler = async (req, res) => {
  const { email, password } = req.body;
  if (email === COUNSELOR_EMAIL) {
    if (password !== COUNSELOR_PASSWORD) return res.status(401).json({ error: 'Invalid credentials' });
    const token = jwt.sign({ email, role: COUNSELOR_ROLE }, 'secret', { expiresIn: '1h' });
    return res.json({ token, user: { name: COUNSELOR_NAME, email, role: COUNSELOR_ROLE } });
  }

  const user = await getUserByEmail(email);
  if (!user || !(await bcrypt.compare(password, user.password))) return res.status(401).json({ error: 'Invalid credentials' });
  const role = user.role || 'student';
  const token = jwt.sign({ email, role }, 'secret', { expiresIn: '1h' });
  res.json({ token, user: { name: user.name, email, role } });
};

const profileHandler = async (req, res) => {
  if (req.user.role === COUNSELOR_ROLE && req.user.email === COUNSELOR_EMAIL) {
    return res.json({ name: COUNSELOR_NAME, email: COUNSELOR_EMAIL, role: COUNSELOR_ROLE });
  }

  const user = await getUserByEmail(req.user.email);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json({ name: user.name, email: req.user.email, role: user.role || 'student' });
};

const getScreeningsHandler = async (req, res) => {
  try {
    if (req.user.role === COUNSELOR_ROLE && req.user.email === COUNSELOR_EMAIL) {
      const screenings = await getAllScreenings();
      return res.json({ screenings });
    }

    const screenings = await getScreeningsByEmail(req.user.email);
    res.json({ screenings });
  } catch (error) {
    console.error('Failed to load screening history:', error);
    res.status(500).json({ error: 'Unable to load screening history' });
  }
};

app.post('/register', registerHandler);
app.post('/api/register', registerHandler);
app.post('/login', loginHandler);
app.post('/api/login', loginHandler);
app.get('/profile', authenticate, profileHandler);
app.get('/api/profile', authenticate, profileHandler);

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

const chatHandler = async (req, res) => {
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
    const prompt = buildPrompt(userInput, emotion, personality);

    // 🤖 Model response
    const response = await chatbot(prompt, {
      max_new_tokens: 80,
    });

    let botReply = response[0].generated_text.trim();

    // 🚨 Fix bad responses
    if (isBadResponse(botReply, userInput)) {
      botReply = smartFallback(userInput, personality);
    }

    const authHeader = req.header('Authorization')?.replace('Bearer ', '');
    let userEmail = null;
    if (authHeader) {
      try {
        const decoded = jwt.verify(authHeader, 'secret');
        userEmail = decoded.email;
      } catch (err) {
        userEmail = null;
      }
    }

    if (userEmail) {
      await saveChatLog({
        userEmail,
        userInput,
        botReply,
        emotion,
        personality,
        createdAt: new Date(),
      });
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
};

const saveScreeningHandler = async (req, res) => {
  const { answers, result, average } = req.body;
  if (!answers || !result || typeof average !== 'number') {
    return res.status(400).json({ error: 'answers, result, and average are required' });
  }

  try {
    await saveScreeningResult({
      userEmail: req.user.email,
      answers,
      result,
      average,
      createdAt: new Date(),
    });
    res.json({ success: true });
  } catch (error) {
    console.error('Failed to save screening result:', error);
    res.status(500).json({ error: 'Unable to save screening result' });
  }
};

app.post("/chat", chatHandler);
app.post("/api/chat", chatHandler);
app.post('/screening-result', authenticate, saveScreeningHandler);
app.post('/api/screening-result', authenticate, saveScreeningHandler);
app.get('/screenings', authenticate, getScreeningsHandler);
app.get('/api/screenings', authenticate, getScreeningsHandler);

// --- Start server ---
const PORT = 3000;
app.listen(PORT, async () => {
  try {
    await connectDb();
    await loadModels();
    console.log(`🚀 Server running at http://localhost:${PORT}`);
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
});

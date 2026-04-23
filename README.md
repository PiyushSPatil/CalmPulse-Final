🧠 CalmPulse
AI-Powered Mental Wellness Assistant
<p align="center"> <img src="https://img.shields.io/badge/AI-RAG-blue?style=for-the-badge" /> <img src="https://img.shields.io/badge/Frontend-React-green?style=for-the-badge" /> <img src="https://img.shields.io/badge/Backend-Node.js-orange?style=for-the-badge" /> <img src="https://img.shields.io/badge/Status-Active-success?style=for-the-badge" /> </p>
🌟 Overview

CalmPulse is an intelligent, full-stack AI platform designed to support mental well-being through emotion-aware conversations, personalized responses, and knowledge-driven AI reasoning.

It integrates RAG (Retrieval-Augmented Generation) with NLP models to deliver context-aware and empathetic responses, making it significantly more advanced than traditional chatbots.

🎥 Demo

👉 (Add your demo video link here)
👉 (Optional: add GIF or screen recording)

🖼️ Screenshots
Chat Interface	Personality Selection	Counselor Dashboard
(Add image)	(Add image)	(Add image)
🚀 Key Features
💬 Intelligent Chatbot
Real-time conversation
Human-like empathetic replies
Supports mental wellness interaction
🧠 Emotion Detection
Classifies user emotion → Positive / Negative
Uses DistilBERT-based NLP model
Enables emotionally aware responses
🎭 Personality-Based Interaction

Customize chatbot behavior:

Mode	Behavior
😊 Friendly	Casual and comforting
🛡️ Guardian	Protective and reassuring
🎓 Mentor	Thoughtful and advisory
📚 RAG (Retrieval-Augmented Generation)
Retrieves relevant mental health knowledge dynamically
Uses:
FAISS (Vector Database)
MiniLM Embeddings
Injects retrieved context into prompts
Produces accurate, non-generic responses
🧠 Chat Memory
Maintains conversation context
Improves response continuity
Reduces repetition
📖 Resources Section
Mental health guides
Self-help content
Coping strategies
🧑‍⚕️ Counselor Dashboard
Monitor user interactions
View behavioral insights
Helps in support analysis
🔐 Role-Based Authentication

Supports:

👤 User
🧑‍⚕️ Counselor
🛠️ Admin

Each role has controlled access levels

🧠 AI Pipeline
⚙️ Tech Stack
🌐 Frontend
React.js
Tailwind CSS
🔧 Backend
Node.js
Express.js
🤖 AI Models
DistilBERT → Emotion Detection
FLAN-T5 → Chat Generation
📚 RAG Components
FAISS (Vector Store)
MiniLM Embeddings (all-MiniLM-L6-v2)
Custom Knowledge Base
📂 Project Structure
CalmPulse/
│
├── frontend/                # React frontend
│
├── backend/
│   ├── app.js              # Main server
│   ├── rag.js              # RAG pipeline
│   ├── data/
│   │   └── mental_health.txt
│   ├── users.json
│
└── README.md
🛠️ Installation
1️⃣ Clone Repository
git clone https://github.com/PiyushSPatil/CalmPulse-Final.git
cd CalmPulse-Final
2️⃣ Backend Setup
cd backend
npm install
node app.js
3️⃣ Frontend Setup
cd frontend
npm install
npm run dev
🧪 API Usage
POST /chat
{
  "message": "I feel anxious",
  "personality": "guardian"
}
Response:
{
  "bot_reply": "You're safe here 💙 Take a moment to breathe slowly.",
  "detected_emotion": "negative"
}
🎯 Why RAG Matters
Without RAG	With RAG
Generic responses	Context-aware responses
No knowledge base	Uses stored knowledge
Repetitive answers	Diverse, relevant replies
📊 Project Highlights

✔ Emotion-aware chatbot
✔ Personalized AI responses
✔ Knowledge-driven reasoning (RAG)
✔ Full-stack architecture
✔ Real-world mental health application

🔮 Future Enhancements
🎤 Voice interaction
📊 Mood analytics dashboard
☁️ Cloud deployment
📱 Mobile app integration
🤝 Real counselor integration
👨‍💻 Contributors
Piyush Patil
Team Member 2
Team Member 3
📄 License

This project is developed for academic purposes and research exploration.

⭐ Acknowledgements
HuggingFace Transformers
LangChain
FAISS
React & Node.js Ecosystem
🚀 Final Note

CalmPulse demonstrates how AI can be responsibly used to support mental health, combining emotional intelligence, personalization, and knowledge-based reasoning.

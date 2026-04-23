🧠 CalmPulse – AI-Powered Mental Wellness Assistant

CalmPulse is a full-stack AI-driven mental wellness platform designed to provide emotional support through intelligent conversations. It combines Natural Language Processing, Retrieval-Augmented Generation (RAG), and personalization to deliver context-aware, empathetic responses.

🚀 Features
💬 AI Chatbot
Real-time conversational chatbot
Human-like, empathetic responses
Designed for mental wellness support
🧠 Emotion Detection
Detects user emotion (Positive / Negative)
Uses pre-trained NLP model
Helps tailor responses based on mood
🎭 Personality-Based Interaction

Users can choose chatbot behavior:

😊 Friendly – casual, supportive tone
🛡️ Guardian – protective, reassuring
🎓 Mentor – thoughtful, advisory
📚 RAG (Retrieval-Augmented Generation)
Retrieves relevant mental health knowledge from a dataset
Uses FAISS vector database + embeddings
Injects retrieved context into prompt
Produces accurate, context-aware responses
🧠 Chat Memory
Maintains conversation context
Avoids repetitive replies
Improves natural interaction flow
📖 Resources Section
Self-help and mental health content
Helps users beyond chatbot interaction
🧑‍⚕️ Counselor Dashboard
View user activity and insights
Helps monitor interaction patterns
Designed for mental health professionals
🔐 Role-Based Authentication

Three user roles:

👤 User – chatbot + resources
🧑‍⚕️ Counselor – dashboard access
🛠️ Admin – full system access
🧠 Tech Stack
Frontend
React.js
Tailwind CSS
Backend
Node.js
Express.js
AI / ML
HuggingFace Transformers
FLAN-T5 (chatbot model)
DistilBERT (emotion detection)
RAG Components
FAISS (vector database)
MiniLM Embeddings (all-MiniLM-L6-v2)
Custom knowledge base (mental_health.txt)
⚙️ System Architecture
User Input
   ↓
Emotion Detection (DistilBERT)
   ↓
Embedding Model (MiniLM)
   ↓
FAISS Vector Search
   ↓
Retrieve Knowledge (RAG)
   ↓
Prompt Engineering
   ↓
FLAN-T5 Model
   ↓
Response Output
📂 Project Structure
CalmPulse/
│
├── frontend/              # React frontend
├── backend/
│   ├── app.js             # Main server
│   ├── rag.js             # RAG implementation
│   ├── data/
│   │   └── mental_health.txt
│   ├── users.json         # User database
│   └── models/
│
└── README.md
🛠️ Installation & Setup
1️⃣ Clone the repository
git clone https://github.com/PiyushSPatil/CalmPulse-Final.git
cd CalmPulse-Final
2️⃣ Backend Setup
cd backend
npm install
3️⃣ Run Backend
node app.js
4️⃣ Frontend Setup
cd frontend
npm install
npm run dev
🧪 Testing the Chat API
Endpoint:
POST /chat
Sample Request:
{
  "message": "I feel anxious",
  "personality": "friendly"
}
🎯 Key Highlights
✅ Context-aware responses using RAG
✅ Personalized chatbot behavior
✅ Emotion-aware interaction
✅ Full-stack implementation
✅ Scalable architecture
🧠 Why RAG?

Without RAG:

Generic chatbot responses

With RAG:

Context-aware, knowledge-based responses

📌 Future Improvements
Voice interaction 🎤
Mood analytics dashboard 📊
Deployment on cloud ☁️
Integration with real counselors

📄 License

This project is developed for academic and research purposes.

⭐ Acknowledgements
HuggingFace Transformers
LangChain
FAISS
React & Node.js community
🚀 Final Note

CalmPulse is designed to demonstrate how AI can be used responsibly to support mental well-being through intelligent, empathetic, and context-aware systems.

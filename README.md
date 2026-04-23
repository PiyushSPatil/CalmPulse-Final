# 🧠 CalmPulse – AI-Powered Mental Wellness Assistant

CalmPulse is a full-stack AI-driven mental wellness platform designed to provide emotional support through intelligent conversations. It combines Natural Language Processing, Retrieval-Augmented Generation (RAG), and personalization to deliver context-aware responses.

---

## 🚀 Features

### 💬 AI Chatbot
- Real-time conversational chatbot
- Human-like empathetic responses
- Designed for mental wellness support

---

### 🧠 Emotion Detection
- Detects user emotion (Positive / Negative)
- Uses a pre-trained NLP model
- Helps tailor responses based on mood

---

### 🎭 Personality-Based Interaction
Users can choose chatbot behavior:

- 😊 Friendly → casual and supportive  
- 🛡️ Guardian → protective and reassuring  
- 🎓 Mentor → thoughtful and advisory  

---

### 📚 RAG (Retrieval-Augmented Generation)
- Retrieves relevant mental health knowledge from a dataset
- Uses FAISS vector database and embeddings
- Injects retrieved context into prompts
- Produces context-aware responses

---

### 🧠 Chat Memory
- Maintains conversation context
- Reduces repetition
- Improves interaction flow

---

### 📖 Resources Section
- Provides mental health guidance
- Helps users beyond chatbot interaction

---

### 🧑‍⚕️ Counselor Dashboard
- View system insights
- Monitor user interactions
- Helps understand behavior patterns

---

### 🔐 Role-Based Authentication
Three user roles:

- 👤 User → chatbot and resources  
- 🧑‍⚕️ Counselor → dashboard access  
- 🛠️ Admin → full system control  

---

## 🧠 Tech Stack

### Frontend
- React.js  
- Tailwind CSS  

### Backend
- Node.js  
- Express.js  

### AI Models
- DistilBERT → Emotion Detection  
- FLAN-T5 → Chatbot  

### RAG Components
- FAISS (Vector Database)  
- MiniLM Embeddings  
- Custom knowledge base  

---

## ⚙️ System Architecture


User Input
↓
Emotion Detection
↓
Embedding Model
↓
FAISS Vector Search
↓
Retrieve Knowledge
↓
Prompt Engineering
↓
Language Model
↓
Response Output


---

## 📂 Project Structure


CalmPulse/
│
├── frontend/ # React frontend
├── backend/
│ ├── app.js # Main server
│ ├── rag.js # RAG implementation
│ ├── data/
│ │ └── mental_health.txt
│ ├── users.json
│
└── README.md


---

## 🛠️ Installation

### 1. Clone the repository

git clone https://github.com/PiyushSPatil/CalmPulse-Final.git

cd CalmPulse-Final


---

### 2. Backend Setup

cd backend
npm install
node app.js


---

### 3. Frontend Setup

cd frontend
npm install
npm run dev


---

## 🧪 API Usage

### POST /chat

Request:

{
"message": "I feel anxious",
"personality": "friendly"
}


Response:

{
"bot_reply": "I understand how overwhelming that can feel 💙 You're not alone.",
"detected_emotion": "negative"
}


---

## 🎯 Why RAG?

Without RAG:
- Generic responses  
- Repetitive answers  

With RAG:
- Context-aware responses  
- Knowledge-based replies  

---

## 📊 Highlights

- Emotion-aware chatbot  
- Personalized responses  
- RAG-based intelligence  
- Full-stack architecture  

---

## 🔮 Future Improvements

- Voice input  
- Mood analytics  
- Cloud deployment  
- Mobile app  

---



## 📄 License

This project is developed for academic purposes.

---

## ⭐ Acknowledgements

- HuggingFace  
- LangChain  
- FAISS  
- React & Node.js  

---

## 🚀 Final Note

CalmPulse demonstrates how AI can be used to support mental well-being through intelligent and

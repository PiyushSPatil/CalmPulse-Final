import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Send, Sparkles, User, Bot, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChatBubble } from "@/components/ChatBubble";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

const personalities = [
  { id: "friendly", label: "Friendly", emoji: "😊" },
  { id: "guardian", label: "Guardian", emoji: "🛡️" },
  { id: "mentor", label: "Mentor", emoji: "🎓" },
];

const initialMessages = [
  {
    message:
      "Hi there! I'm your CalmPulse AI buddy. How are you feeling today? 💙",
    isAI: true,
    timestamp: "10:00 AM",
  },
];

export default function Chat() {
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState("");
  const [personality, setPersonality] = useState("friendly");
  const [userMessageCount, setUserMessageCount] = useState(0);
  const { user } = useAuth();
  const navigate = useNavigate();
  const MAX_MESSAGES_WITHOUT_LOGIN = 2;

  useEffect(() => {
    // Restore message count from localStorage if user is not logged in
    if (!user) {
      const saved = localStorage.getItem("unauthedChatCount");
      if (saved) {
        setUserMessageCount(parseInt(saved));
      }
    }
  }, [user]);

  const handleSend = async () => {
    if (!input.trim()) return;

    // Check if unauthenticated user has reached the limit
    if (!user && userMessageCount >= MAX_MESSAGES_WITHOUT_LOGIN) {
      return;
    }

    const userMsg = {
      message: input,
      isAI: false,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    // Increment message count for unauthenticated users
    if (!user) {
      const newCount = userMessageCount + 1;
      setUserMessageCount(newCount);
      localStorage.setItem("unauthedChatCount", newCount.toString());
    }

    try {
      const token = localStorage.getItem("token");
      const headers = {
        "Content-Type": "application/json",
      };
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const res = await fetch("/api/chat", {
        method: "POST",
        headers,
        body: JSON.stringify({
          message: input,
          personality: personality,
        }),
      });

      const data = await res.json();

      const botMsg = {
        message: data.bot_reply || "I'm here for you 💙",
        isAI: true,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error(err);

      setMessages((prev) => [
        ...prev,
        {
          message: "Something went wrong. Please try again.",
          isAI: true,
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)]">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-4"
      >
        <div>
          <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
            <Bot className="w-5 h-5 text-primary" /> AI Chat Support
          </h1>
          <p className="text-xs text-muted-foreground">
            Your safe space to talk
            {!user && (
              <span className="ml-2 inline-block px-2 py-0.5 rounded-full bg-primary/20 text-primary text-xs font-medium">
                {MAX_MESSAGES_WITHOUT_LOGIN - userMessageCount} free {MAX_MESSAGES_WITHOUT_LOGIN - userMessageCount === 1 ? 'chat' : 'chats'} left
              </span>
            )}
          </p>
        </div>
        <div className="flex gap-2">
          {personalities.map((p) => (
            <button
              key={p.id}
              onClick={() => setPersonality(p.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                personality === p.id
                  ? "bg-primary text-primary-foreground"
                  : "glass hover:bg-muted"
              }`}
            >
              {p.emoji} {p.label}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Login Limit Notice */}
      {!user && userMessageCount >= MAX_MESSAGES_WITHOUT_LOGIN && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 glass-strong rounded-2xl p-4 border border-primary/30 bg-gradient-to-r from-primary/10 to-primary/5"
        >
          <div className="flex items-center gap-3 mb-3">
            <Lock className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-foreground">Chat Limit Reached</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            You've used your 2 free chat messages. Sign in to unlock unlimited conversations and access more features like personalized support and resources.
          </p>
          <div className="flex gap-2">
            <Button
              onClick={() => navigate("/login")}
              className="flex-1 rounded-xl"
            >
              Sign In
            </Button>
            <Button
              onClick={() => navigate("/register")}
              variant="outline"
              className="flex-1 rounded-xl"
            >
              Create Account
            </Button>
          </div>
        </motion.div>
      )}

      {/* Chat area */}
      <div className="flex-1 overflow-y-auto glass rounded-2xl p-4 mb-4 space-y-1">
        {messages.map((msg, i) => (
          <ChatBubble key={i} {...msg} />
        ))}
      </div>

      {/* Input */}
      <div className="glass-strong rounded-2xl p-2 flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder={
            !user && userMessageCount >= MAX_MESSAGES_WITHOUT_LOGIN
              ? "Please sign in to continue chatting..."
              : "Type your message..."
          }
          disabled={!user && userMessageCount >= MAX_MESSAGES_WITHOUT_LOGIN}
          className="flex-1 bg-transparent px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none disabled:opacity-50 disabled:cursor-not-allowed"
        />
        <Button
          onClick={handleSend}
          disabled={!user && userMessageCount >= MAX_MESSAGES_WITHOUT_LOGIN}
          size="icon"
          className="rounded-xl h-11 w-11 shrink-0"
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}

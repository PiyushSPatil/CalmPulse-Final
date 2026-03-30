import { useState } from "react";
import { motion } from "framer-motion";
import { Send, Sparkles, User, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChatBubble } from "@/components/ChatBubble";

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

  const handleSend = async () => {
    if (!input.trim()) return;

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

    try {
      const res = await fetch("http://localhost:3000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
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
          placeholder="Type your message..."
          className="flex-1 bg-transparent px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none"
        />
        <Button
          onClick={handleSend}
          size="icon"
          className="rounded-xl h-11 w-11 shrink-0"
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}

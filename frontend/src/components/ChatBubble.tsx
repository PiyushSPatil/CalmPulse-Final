import { motion } from "framer-motion";

interface ChatBubbleProps {
  message: string;
  isAI?: boolean;
  timestamp?: string;
}

export function ChatBubble({ message, isAI = false, timestamp }: ChatBubbleProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex ${isAI ? "justify-start" : "justify-end"} mb-4`}
    >
      <div
        className={`max-w-[80%] px-4 py-3 rounded-2xl ${
          isAI
            ? "glass rounded-tl-md"
            : "bg-primary text-primary-foreground rounded-tr-md"
        }`}
      >
        <p className="text-sm leading-relaxed">{message}</p>
        {timestamp && (
          <span className="text-[10px] opacity-60 mt-1 block text-right">{timestamp}</span>
        )}
      </div>
    </motion.div>
  );
}

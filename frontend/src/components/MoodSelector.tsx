import { Smile, Meh, Frown, Heart, Angry } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

const moods = [
  { icon: Angry, label: "Awful", color: "text-soft-rose-foreground bg-soft-rose" },
  { icon: Frown, label: "Bad", color: "text-warm-amber-foreground bg-warm-amber" },
  { icon: Meh, label: "Okay", color: "text-muted-foreground bg-muted" },
  { icon: Smile, label: "Good", color: "text-calm-blue-foreground bg-calm-blue" },
  { icon: Heart, label: "Great", color: "text-soft-green-foreground bg-soft-green" },
];

export function MoodSelector() {
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <div className="flex gap-3 justify-center">
      {moods.map((mood, i) => (
        <motion.button
          key={mood.label}
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setSelected(i)}
          className={`flex flex-col items-center gap-1.5 p-3 rounded-2xl transition-all duration-200 ${
            selected === i ? mood.color + " shadow-soft ring-2 ring-primary/20" : "hover:bg-muted"
          }`}
        >
          <mood.icon className="w-7 h-7" />
          <span className="text-xs font-medium">{mood.label}</span>
        </motion.button>
      ))}
    </div>
  );
}

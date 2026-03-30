import { motion } from "framer-motion";
import { Wind, Brain, Heart, Dumbbell, Music, Leaf } from "lucide-react";

const resources = [
  { icon: Wind, title: "Box Breathing", desc: "A simple 4-4-4-4 technique to calm your nervous system in seconds.", category: "Breathing", color: "bg-calm-blue text-calm-blue-foreground" },
  { icon: Brain, title: "Grounding Exercise", desc: "5-4-3-2-1 sensory exercise to bring you back to the present moment.", category: "Mindfulness", color: "bg-lavender text-lavender-foreground" },
  { icon: Heart, title: "Self-Compassion Journal", desc: "Write three kind things to yourself to build emotional resilience.", category: "Journaling", color: "bg-soft-rose text-soft-rose-foreground" },
  { icon: Dumbbell, title: "Desk Stretches", desc: "Quick 5-minute stretch routine to release tension during study sessions.", category: "Physical", color: "bg-soft-green text-soft-green-foreground" },
  { icon: Music, title: "Calm Playlist", desc: "Curated lo-fi and nature sounds to help you focus and relax.", category: "Audio", color: "bg-warm-amber text-warm-amber-foreground" },
  { icon: Leaf, title: "Progressive Relaxation", desc: "Tense and release each muscle group to melt away physical stress.", category: "Relaxation", color: "bg-calm-blue text-calm-blue-foreground" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.4 } }),
};

export default function Resources() {
  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-foreground">Resource Hub 📚</h1>
        <p className="text-sm text-muted-foreground mt-1">Coping exercises, guides, and techniques for your wellbeing.</p>
      </motion.div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {resources.map((r, i) => (
          <motion.div
            key={r.title}
            variants={fadeUp}
            custom={i}
            initial="hidden"
            animate="visible"
            className="glass rounded-2xl p-6 hover:shadow-glass transition-all duration-300 cursor-pointer group"
          >
            <div className="flex items-start justify-between mb-3">
              <div className={`w-11 h-11 rounded-xl ${r.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                <r.icon className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-medium px-2 py-1 rounded-full bg-muted text-muted-foreground">{r.category}</span>
            </div>
            <h3 className="font-semibold text-foreground mb-1.5">{r.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{r.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

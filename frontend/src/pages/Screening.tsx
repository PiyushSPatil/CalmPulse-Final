import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ClipboardList, ChevronRight, AlertTriangle, CheckCircle, AlertCircle, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CrisisAlert } from "@/components/CrisisAlert";
import { useAuth } from "@/hooks/useAuth";

const questions = [
  { q: "How often have you felt nervous or anxious in the past 2 weeks?", options: ["Not at all", "Several days", "More than half the days", "Nearly every day"] },
  { q: "How often have you felt down, depressed, or hopeless?", options: ["Not at all", "Several days", "More than half the days", "Nearly every day"] },
  { q: "How often have you had trouble falling or staying asleep?", options: ["Not at all", "Several days", "More than half the days", "Nearly every day"] },
  { q: "How often have you felt tired or had little energy?", options: ["Not at all", "Several days", "More than half the days", "Nearly every day"] },
  { q: "How often have you had trouble concentrating on things?", options: ["Not at all", "Several days", "More than half the days", "Nearly every day"] },
];

type RiskLevel = "low" | "moderate" | "high";

const riskConfig: Record<RiskLevel, { icon: typeof CheckCircle; label: string; color: string; bg: string; desc: string }> = {
  low: { icon: CheckCircle, label: "Low Risk", color: "text-soft-green-foreground", bg: "bg-soft-green", desc: "You seem to be doing well! Keep up your self-care habits." },
  moderate: { icon: AlertCircle, label: "Moderate Risk", color: "text-warm-amber-foreground", bg: "bg-warm-amber", desc: "Some areas need attention. Consider exploring our resources." },
  high: { icon: AlertTriangle, label: "High Risk", color: "text-soft-rose-foreground", bg: "bg-soft-rose", desc: "We recommend reaching out to a counselor for support." },
};

export default function Screening() {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [result, setResult] = useState<RiskLevel | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleAnswer = (score: number) => {
    const newAnswers = [...answers, score];
    setAnswers(newAnswers);
    if (current < questions.length - 1) {
      setCurrent(current + 1);
    } else {
      const total = newAnswers.reduce((a, b) => a + b, 0);
      const avg = total / questions.length;
      setResult(avg < 1.5 ? "low" : avg < 2.5 ? "moderate" : "high");
    }
  };

  const progress = ((result ? questions.length : current) / questions.length) * 100;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <ClipboardList className="w-6 h-6 text-primary" /> Mental Health Screening
        </h1>
        <p className="text-sm text-muted-foreground mt-1">A quick check-in to understand how you're doing.</p>
      </motion.div>

      {/* Progress */}
      <div className="glass rounded-full h-2 overflow-hidden">
        <motion.div animate={{ width: `${progress}%` }} className="h-full bg-primary rounded-full" transition={{ duration: 0.4 }} />
      </div>
      <p className="text-xs text-muted-foreground text-right">{result ? "Complete" : `${current + 1} of ${questions.length}`}</p>

      <AnimatePresence mode="wait">
        {result ? (
          !user ? (
            // Login prompt for viewing results
            <motion.div key="login" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
              <div className="glass rounded-2xl p-8 text-center space-y-6">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
                  <Lock className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-foreground mb-2">View Your Results</h2>
                  <p className="text-sm text-muted-foreground">Sign in to view your screening results and get personalized recommendations based on your answers.</p>
                </div>
                <div className="space-y-3">
                  <Button 
                    onClick={() => navigate("/login")}
                    className="w-full rounded-xl"
                  >
                    Sign In
                  </Button>
                  <Button 
                    onClick={() => navigate("/register")}
                    variant="outline"
                    className="w-full rounded-xl"
                  >
                    Create Account
                  </Button>
                </div>
                <Button 
                  onClick={() => { setCurrent(0); setAnswers([]); setResult(null); }}
                  variant="ghost"
                  className="w-full rounded-xl"
                >
                  Retake Screening
                </Button>
              </div>
            </motion.div>
          ) : (
            // Result display for logged-in users
            <motion.div key="result" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
              {/* Result card */}
              <div className="glass rounded-2xl p-6 text-center space-y-4">
                <div className={`w-16 h-16 rounded-2xl ${riskConfig[result].bg} flex items-center justify-center mx-auto`}>
                  {(() => { const Icon = riskConfig[result].icon; return <Icon className={`w-8 h-8 ${riskConfig[result].color}`} />; })()}
                </div>
                <h2 className="text-xl font-bold text-foreground">{riskConfig[result].label}</h2>
                <p className="text-sm text-muted-foreground">{riskConfig[result].desc}</p>
                <Button variant="outline" className="rounded-xl" onClick={() => { setCurrent(0); setAnswers([]); setResult(null); }}>
                  Retake Screening
                </Button>
              </div>
              {result === "high" && <CrisisAlert />}
            </motion.div>
          )
        ) : (
          <motion.div key={current} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="glass rounded-2xl p-6 space-y-4">
            <h2 className="text-lg font-semibold text-foreground">{questions[current].q}</h2>
            <div className="space-y-2">
              {questions[current].options.map((opt, i) => (
                <button
                  key={opt}
                  onClick={() => handleAnswer(i)}
                  className="w-full text-left px-4 py-3 rounded-xl text-sm font-medium border border-border/50 hover:bg-primary/5 hover:border-primary/30 transition-all flex items-center justify-between group"
                >
                  {opt}
                  <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, ArrowRight, ArrowLeft, Sparkles, Sun, Moon, Cloud, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Progress } from "@/components/ui/progress";

const stressLevels = ["Very Low", "Low", "Moderate", "High", "Very High"];
const sleepOptions = ["Less than 5h", "5-6h", "6-7h", "7-8h", "More than 8h"];
const moodOptions = [
  { emoji: "😊", label: "Happy" },
  { emoji: "😐", label: "Neutral" },
  { emoji: "😔", label: "Sad" },
  { emoji: "😰", label: "Anxious" },
  { emoji: "😡", label: "Frustrated" },
];

const personalities = [
  { id: "friendly", emoji: "😊", label: "Friendly Buddy", desc: "Warm, supportive, and casual — like chatting with a close friend." },
  { id: "guardian", emoji: "🛡️", label: "Guardian", desc: "Protective and reassuring — provides structured guidance and safety." },
  { id: "mentor", emoji: "🎓", label: "Mentor", desc: "Wise and encouraging — offers insights and helps you grow." },
];

export default function Onboarding() {
  const [step, setStep] = useState(0);
  const [stress, setStress] = useState<string | null>(null);
  const [sleep, setSleep] = useState<string | null>(null);
  const [mood, setMood] = useState<string | null>(null);
  const [personality, setPersonality] = useState<string | null>(null);
  const navigate = useNavigate();

  const totalSteps = 4;
  const progress = ((step + 1) / totalSteps) * 100;

  const canProceed = () => {
    if (step === 1) return mood !== null;
    if (step === 2) return stress !== null && sleep !== null;
    if (step === 3) return personality !== null;
    return true;
  };

  const handleFinish = () => {
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen gradient-calm flex items-center justify-center px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg"
      >
        {/* Logo */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <Heart className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">CalmPulse</span>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-6">
          <Progress value={progress} className="h-2" />
          <p className="text-xs text-muted-foreground mt-2 text-center">Step {step + 1} of {totalSteps}</p>
        </div>

        {/* Card */}
        <div className="glass-strong rounded-2xl p-8">
          <AnimatePresence mode="wait">
            {/* Step 0: Welcome */}
            {step === 0 && (
              <motion.div key="welcome" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="text-center space-y-4">
                <div className="w-20 h-20 rounded-full bg-calm-blue mx-auto flex items-center justify-center">
                  <Sparkles className="w-10 h-10 text-calm-blue-foreground" />
                </div>
                <h1 className="text-2xl font-bold text-foreground">Welcome to CalmPulse 💙</h1>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  This is your safe space. We're here to support your emotional wellbeing with AI-powered tools, mood tracking, and wellness resources.
                </p>
                <p className="text-muted-foreground text-xs">
                  Let's start with a few quick questions to personalize your experience. Everything is completely confidential.
                </p>
              </motion.div>
            )}

            {/* Step 1: Current mood */}
            {step === 1 && (
              <motion.div key="mood" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
                <div className="text-center">
                  <h2 className="text-xl font-bold text-foreground">How are you feeling right now?</h2>
                  <p className="text-sm text-muted-foreground mt-1">Pick the one that resonates most</p>
                </div>
                <div className="flex justify-center gap-3">
                  {moodOptions.map((m) => (
                    <button
                      key={m.label}
                      onClick={() => setMood(m.label)}
                      className={`flex flex-col items-center gap-1.5 p-3 rounded-2xl transition-all ${
                        mood === m.label ? "bg-primary/10 ring-2 ring-primary/30 shadow-soft" : "hover:bg-muted"
                      }`}
                    >
                      <span className="text-3xl">{m.emoji}</span>
                      <span className="text-xs font-medium text-foreground">{m.label}</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Step 2: Stress + Sleep */}
            {step === 2 && (
              <motion.div key="stress" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                <div className="text-center">
                  <h2 className="text-xl font-bold text-foreground">A bit more about you</h2>
                  <p className="text-sm text-muted-foreground mt-1">This helps us tailor your experience</p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground flex items-center gap-2">
                    <Zap className="w-4 h-4 text-warm-amber-foreground" /> Current stress level
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {stressLevels.map((s) => (
                      <button
                        key={s}
                        onClick={() => setStress(s)}
                        className={`px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                          stress === s ? "bg-primary text-primary-foreground" : "glass hover:bg-muted"
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground flex items-center gap-2">
                    <Moon className="w-4 h-4 text-lavender-foreground" /> Average sleep per night
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {sleepOptions.map((s) => (
                      <button
                        key={s}
                        onClick={() => setSleep(s)}
                        className={`px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                          sleep === s ? "bg-primary text-primary-foreground" : "glass hover:bg-muted"
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 3: Personality */}
            {step === 3 && (
              <motion.div key="personality" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
                <div className="text-center">
                  <h2 className="text-xl font-bold text-foreground">Choose your AI companion style</h2>
                  <p className="text-sm text-muted-foreground mt-1">You can always change this later</p>
                </div>
                <div className="space-y-3">
                  {personalities.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setPersonality(p.id)}
                      className={`w-full flex items-start gap-4 p-4 rounded-2xl text-left transition-all ${
                        personality === p.id ? "bg-primary/10 ring-2 ring-primary/30 shadow-soft" : "glass hover:bg-muted"
                      }`}
                    >
                      <span className="text-3xl">{p.emoji}</span>
                      <div>
                        <h3 className="text-sm font-semibold text-foreground">{p.label}</h3>
                        <p className="text-xs text-muted-foreground mt-0.5">{p.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation buttons */}
          <div className="flex justify-between mt-8">
            {step > 0 ? (
              <Button variant="ghost" onClick={() => setStep(step - 1)} className="gap-2 rounded-xl">
                <ArrowLeft className="w-4 h-4" /> Back
              </Button>
            ) : <div />}
            {step < totalSteps - 1 ? (
              <Button onClick={() => setStep(step + 1)} disabled={!canProceed()} className="gap-2 rounded-xl">
                Next <ArrowRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button onClick={handleFinish} disabled={!canProceed()} className="gap-2 rounded-xl">
                Get Started <Sparkles className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Heart, MessageCircle, BarChart3, Shield, BookOpen, ArrowRight, Sparkles,
  Activity, Brain, Phone, Users, Settings, TrendingUp, Calendar, Bell, Smile,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import heroBg from "@/assets/hero-bg.jpg";

/* ── mock widget data ── */
const moodHistory = [
  { emoji: "😊", label: "Happy", day: "Mon" },
  { emoji: "😐", label: "Okay", day: "Tue" },
  { emoji: "😔", label: "Low", day: "Wed" },
  { emoji: "😊", label: "Happy", day: "Thu" },
  { emoji: "🤩", label: "Great", day: "Fri" },
  { emoji: "😌", label: "Calm", day: "Sat" },
  { emoji: "😊", label: "Happy", day: "Sun" },
];

const recentChats = [
  { msg: "I've been feeling anxious about exams…", time: "2h ago", isUser: true },
  { msg: "That's completely valid. Let's work through this together 💙", time: "2h ago", isUser: false },
];

const stressLevel = 42;

/* ── feature showcase ── */
const features = [
  { icon: BarChart3, title: "Mood Tracking", desc: "Track emotional patterns daily with simple mood check-ins and visual analytics", color: "bg-calm-blue text-calm-blue-foreground" },
  { icon: MessageCircle, title: "AI Chat Support", desc: "Talk to your AI companion anytime — it listens without judgment", color: "bg-lavender text-lavender-foreground" },
  { icon: BookOpen, title: "Wellness Plans", desc: "Personalized exercises, breathing techniques, and mindfulness guides", color: "bg-soft-green text-soft-green-foreground" },
  { icon: Shield, title: "Anonymous Support", desc: "Your privacy is sacred. No names, no judgment, just help", color: "bg-warm-amber text-warm-amber-foreground" },
];

/* ── navigation modules ── */
const modules = [
  { icon: MessageCircle, title: "AI Chat", desc: "Start a conversation", to: "/chat", color: "bg-lavender text-lavender-foreground" },
  { icon: BarChart3, title: "Dashboard", desc: "View your progress", to: "/dashboard", color: "bg-calm-blue text-calm-blue-foreground" },
  { icon: BookOpen, title: "Resources", desc: "Self-help library", to: "/resources", color: "bg-soft-green text-soft-green-foreground" },
  { icon: Brain, title: "Screening", desc: "Mental health check", to: "/screening", color: "bg-secondary text-secondary-foreground" },
  { icon: Users, title: "Counselor", desc: "Professional support", to: "/counselor", color: "bg-warm-amber text-warm-amber-foreground" },
  { icon: Activity, title: "Exercises", desc: "Wellness activities", to: "/resources", color: "bg-soft-rose text-soft-rose-foreground" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const },
  }),
};

export default function Landing() {
  return (
    <div className="min-h-screen">
      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 glass-strong">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Heart className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold text-foreground">CalmPulse</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button variant="ghost" size="sm" className="rounded-xl text-sm">Login</Button>
            </Link>
            <Link to="/register">
              <Button size="sm" className="rounded-xl text-sm">Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <img src={heroBg} alt="" className="absolute inset-0 w-full h-full object-cover opacity-40" />
        <div className="absolute inset-0 gradient-hero opacity-80" />
        <div className="relative z-10 max-w-3xl mx-auto text-center px-4 pt-16">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-sm text-muted-foreground mb-6">
              <Sparkles className="w-4 h-4 text-primary" />
              <span>AI-Powered Mental Wellness</span>
            </div>
          </motion.div>
          <motion.h1 variants={fadeUp} custom={1} initial="hidden" animate="visible" className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-foreground leading-tight mb-6">
            Your 24/7 AI{" "}
            <span className="text-gradient">Emotional Support</span>{" "}
            Companion
          </motion.h1>
          <motion.p variants={fadeUp} custom={2} initial="hidden" animate="visible" className="text-lg text-muted-foreground max-w-xl mx-auto mb-8">
            A safe space for students to track mood, chat with an AI buddy, and access wellness resources — anytime, anonymously.
          </motion.p>
          <motion.div variants={fadeUp} custom={3} initial="hidden" animate="visible" className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/chat">
              <Button size="lg" className="rounded-xl gap-2 text-base px-6">
                <MessageCircle className="w-5 h-5" /> Start Chat
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button size="lg" variant="outline" className="rounded-xl gap-2 text-base px-6">
                <BarChart3 className="w-5 h-5" /> Track Mood
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── MINI DASHBOARD WIDGETS ── */}
      <section className="py-20 gradient-calm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-12">
            <motion.h2 variants={fadeUp} custom={0} className="text-3xl font-bold text-foreground mb-3">
              Your Wellness at a Glance
            </motion.h2>
            <motion.p variants={fadeUp} custom={1} className="text-muted-foreground max-w-lg mx-auto">
              Live widgets that keep you connected to your mental health journey.
            </motion.p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Mood Widget */}
            <motion.div variants={fadeUp} custom={0} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <Card className="glass rounded-2xl border-border/50 h-full">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Smile className="w-5 h-5 text-primary" />
                    <h3 className="font-semibold text-foreground">Weekly Mood</h3>
                  </div>
                  <div className="flex justify-between">
                    {moodHistory.map((m) => (
                      <div key={m.day} className="flex flex-col items-center gap-1">
                        <span className="text-2xl">{m.emoji}</span>
                        <span className="text-xs text-muted-foreground">{m.day}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Chat Preview Widget */}
            <motion.div variants={fadeUp} custom={1} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <Card className="glass rounded-2xl border-border/50 h-full">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <MessageCircle className="w-5 h-5 text-primary" />
                    <h3 className="font-semibold text-foreground">Recent Chat</h3>
                  </div>
                  <div className="space-y-3">
                    {recentChats.map((c, i) => (
                      <div key={i} className={`flex ${c.isUser ? "justify-end" : "justify-start"}`}>
                        <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${c.isUser ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"}`}>
                          {c.msg}
                        </div>
                      </div>
                    ))}
                  </div>
                  <Link to="/chat">
                    <Button variant="ghost" size="sm" className="mt-3 w-full rounded-xl text-primary text-xs">
                      Continue chatting →
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>

            {/* Stress Level Widget */}
            <motion.div variants={fadeUp} custom={2} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <Card className="glass rounded-2xl border-border/50 h-full">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <TrendingUp className="w-5 h-5 text-primary" />
                    <h3 className="font-semibold text-foreground">Stress Level</h3>
                  </div>
                  <div className="text-center mb-4">
                    <span className="text-5xl font-bold text-foreground">{stressLevel}%</span>
                    <p className="text-sm text-muted-foreground mt-1">Below average — you're doing great!</p>
                  </div>
                  <Progress value={stressLevel} className="h-3 rounded-full" />
                  <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                    <span>Low</span>
                    <span>High</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── FEATURE SHOWCASE ── */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-16">
            <motion.h2 variants={fadeUp} custom={0} className="text-3xl font-bold text-foreground mb-3">
              Everything You Need to Feel Better
            </motion.h2>
            <motion.p variants={fadeUp} custom={1} className="text-muted-foreground max-w-lg mx-auto">
              Tools designed with empathy, backed by research, built for students.
            </motion.p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                variants={fadeUp}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="glass rounded-2xl p-6 hover:shadow-glass transition-shadow duration-300 group cursor-pointer"
              >
                <div className={`w-12 h-12 rounded-xl ${f.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <f.icon className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── NAVIGATION MODULE GRID ── */}
      <section className="py-20 gradient-calm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-12">
            <motion.h2 variants={fadeUp} custom={0} className="text-3xl font-bold text-foreground mb-3">
              Explore CalmPulse
            </motion.h2>
            <motion.p variants={fadeUp} custom={1} className="text-muted-foreground max-w-lg mx-auto">
              Jump straight into any module — your wellness toolkit is one click away.
            </motion.p>
          </motion.div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {modules.map((m, i) => (
              <motion.div key={m.title} variants={fadeUp} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                <Link to={m.to}>
                  <Card className="glass rounded-2xl border-border/50 hover:shadow-glass transition-all duration-300 group cursor-pointer h-full">
                    <CardContent className="p-5 flex flex-col items-center text-center">
                      <div className={`w-12 h-12 rounded-xl ${m.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                        <m.icon className="w-6 h-6" />
                      </div>
                      <h3 className="font-semibold text-foreground text-sm mb-1">{m.title}</h3>
                      <p className="text-xs text-muted-foreground">{m.desc}</p>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="glass-strong rounded-3xl p-10">
            <motion.h2 variants={fadeUp} custom={0} className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
              Ready to Start Your Wellness Journey?
            </motion.h2>
            <motion.p variants={fadeUp} custom={1} className="text-muted-foreground mb-6">
              Join thousands of students who've found calm with CalmPulse.
            </motion.p>
            <motion.div variants={fadeUp} custom={2}>
              <Link to="/register">
                <Button size="lg" className="rounded-xl gap-2 px-8">
                  Get Started Free <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border/50">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-primary" />
            <span className="text-sm text-muted-foreground">CalmPulse © 2026</span>
          </div>
          <p className="text-xs text-muted-foreground">Made with care for student wellbeing</p>
        </div>
      </footer>
    </div>
  );
}

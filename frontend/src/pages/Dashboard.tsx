import { motion } from "framer-motion";
import { MessageCircle, BookOpen, Activity, TrendingUp, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MoodSelector } from "@/components/MoodSelector";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const stressData = [
  { day: "Mon", stress: 4 }, { day: "Tue", stress: 6 }, { day: "Wed", stress: 5 },
  { day: "Thu", stress: 7 }, { day: "Fri", stress: 3 }, { day: "Sat", stress: 2 }, { day: "Sun", stress: 4 },
];

const quickActions = [
  { icon: MessageCircle, label: "Chat with AI Buddy", to: "/chat", color: "bg-lavender text-lavender-foreground" },
  { icon: BookOpen, label: "Self-help Resources", to: "/resources", color: "bg-calm-blue text-calm-blue-foreground" },
  { icon: Activity, label: "Wellness Exercises", to: "/resources", color: "bg-soft-green text-soft-green-foreground" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.4 } }),
};

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0}>
        <h1 className="text-2xl font-bold text-foreground">Good morning! 🌤️</h1>
        <p className="text-muted-foreground text-sm mt-1">How are you feeling today?</p>
      </motion.div>

      {/* Mood Tracking */}
      <motion.div variants={fadeUp} custom={1} initial="hidden" animate="visible" className="glass rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="w-5 h-5 text-primary" />
          <h2 className="font-semibold text-foreground">Today's Mood Check-in</h2>
        </div>
        <MoodSelector />
      </motion.div>

      {/* Stress Chart */}
      <motion.div variants={fadeUp} custom={2} initial="hidden" animate="visible" className="glass rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-primary" />
          <h2 className="font-semibold text-foreground">Weekly Stress Trend</h2>
        </div>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={stressData}>
              <defs>
                <linearGradient id="stressGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(230, 70%, 58%)" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="hsl(230, 70%, 58%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="day" axisLine={false} tickLine={false} fontSize={12} />
              <YAxis hide domain={[0, 10]} />
              <Tooltip
                contentStyle={{
                  background: "rgba(255,255,255,0.8)",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(255,255,255,0.5)",
                  borderRadius: "12px",
                  fontSize: "12px",
                }}
              />
              <Area type="monotone" dataKey="stress" stroke="hsl(230, 70%, 58%)" fill="url(#stressGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div variants={fadeUp} custom={3} initial="hidden" animate="visible">
        <h2 className="font-semibold text-foreground mb-3">Quick Actions</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          {quickActions.map((action) => (
            <Link key={action.label} to={action.to}>
              <div className="glass rounded-2xl p-5 hover:shadow-glass transition-all duration-200 group cursor-pointer">
                <div className={`w-10 h-10 rounded-xl ${action.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                  <action.icon className="w-5 h-5" />
                </div>
                <span className="text-sm font-medium text-foreground">{action.label}</span>
              </div>
            </Link>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

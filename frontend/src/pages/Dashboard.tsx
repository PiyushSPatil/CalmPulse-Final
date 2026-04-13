import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { MessageCircle, BookOpen, Activity, TrendingUp, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MoodSelector } from "@/components/MoodSelector";
import { useAuth } from "@/hooks/useAuth";
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

type ScreeningRecord = {
  _id: string;
  userEmail: string;
  result: string;
  average: number;
  answers: number[];
  createdAt: string;
};

export default function Dashboard() {
  const { user } = useAuth();
  const [screenings, setScreenings] = useState<ScreeningRecord[]>([]);
  const [loadingScreenings, setLoadingScreenings] = useState(true);
  const [manualMood, setManualMood] = useState<number | null>(null);
  const [selectedScreening, setSelectedScreening] = useState<ScreeningRecord | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const computedMoodIndex = useMemo(() => {
    if (screenings.length === 0) return null;
    const overall = screenings.reduce((sum, screening) => sum + screening.average, 0) / screenings.length;
    if (overall <= 0.5) return 4;
    if (overall <= 1.0) return 3;
    if (overall <= 1.5) return 2;
    if (overall <= 2.25) return 1;
    return 0;
  }, [screenings]);

  const openDetails = (screening: ScreeningRecord) => {
    setSelectedScreening(screening);
    setIsDetailsOpen(true);
  };

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("/api/screenings", {
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });
        if (res.ok) {
          const data = await res.json();
          setScreenings(data.screenings || []);
        }
      } catch (error) {
        console.error("Failed to load screening history:", error);
      } finally {
        setLoadingScreenings(false);
      }
    };

    if (user) {
      fetchHistory();
    } else {
      setLoadingScreenings(false);
    }
  }, [user]);

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
        <p className="text-sm text-muted-foreground mb-4">
          {user && screenings.length === 0
            ? 'Looks like this is your first login — no mood history yet.'
            : computedMoodIndex !== null
            ? 'Mood is calculated from your screening history.'
            : 'Tap a mood to record how you feel today.'}
        </p>
        <MoodSelector
          selectedMood={manualMood ?? computedMoodIndex}
          onSelect={(value) => setManualMood(value)}
          readOnly={computedMoodIndex !== null}
        />
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

      <motion.div variants={fadeUp} custom={4} initial="hidden" animate="visible" className="glass rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Screening History</h2>
            <p className="text-sm text-muted-foreground">{user?.role === 'counselor' ? 'Overview of recent student screenings' : 'Your recent screening results'}</p>
          </div>
        </div>
        {loadingScreenings ? (
          <p className="text-sm text-muted-foreground">Loading screening history...</p>
        ) : screenings.length === 0 ? (
          <p className="text-sm text-muted-foreground">No screening history available yet.</p>
        ) : (
          <div className="space-y-3 overflow-x-auto">
            <div className="min-w-[650px]">
              <div className="grid grid-cols-[2fr_1fr_1fr_1.5fr_auto] gap-4 text-xs uppercase tracking-[0.12em] text-muted-foreground border-b border-border/50 pb-2 mb-2">
                <span>Date</span>
                <span>Result</span>
                <span>Average</span>
                <span>{user?.role === 'counselor' ? 'Student email' : 'Answers'}</span>
                <span>Action</span>
              </div>
              {screenings.slice(0, 6).map((screening) => (
                <div key={screening._id} className="grid grid-cols-[2fr_1fr_1fr_1.5fr_auto] gap-4 py-3 border-b border-border/20 text-sm text-foreground items-center">
                  <span>{new Date(screening.createdAt).toLocaleString()}</span>
                  <span className="font-medium capitalize">{screening.result}</span>
                  <span>{screening.average.toFixed(2)}</span>
                  <span className="text-muted-foreground truncate">{user?.role === 'counselor' ? screening.userEmail : screening.answers.slice(0, 3).join(', ')}</span>
                  <Button size="sm" variant="outline" onClick={() => openDetails(screening)} className="rounded-xl">
                    View details
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </motion.div>

      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Screening details</DialogTitle>
            <DialogDescription>Review the saved answers and summary for this screening.</DialogDescription>
          </DialogHeader>
          {selectedScreening ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Student email</p>
                  <p className="text-sm text-foreground">{selectedScreening.userEmail}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Result</p>
                  <p className="text-sm font-medium text-foreground capitalize">{selectedScreening.result}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Average score</p>
                  <p className="text-sm text-foreground">{selectedScreening.average.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Submitted</p>
                  <p className="text-sm text-foreground">{new Date(selectedScreening.createdAt).toLocaleString()}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-2">Answers</p>
                <div className="space-y-2 rounded-2xl bg-muted/50 p-4">
                  {selectedScreening.answers.map((answer, index) => (
                    <div key={index} className="flex items-center justify-between rounded-xl border border-border/50 bg-background px-3 py-2 text-sm">
                      <span>Question {index + 1}</span>
                      <strong>{answer}</strong>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Select a screening entry to view details.</p>
          )}
          <DialogFooter>
            <Button type="button" onClick={() => setIsDetailsOpen(false)} className="rounded-xl">
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

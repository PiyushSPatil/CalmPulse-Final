import { motion } from "framer-motion";
import { AlertTriangle, MessageCircle, User, Shield, Clock, ChevronRight, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";

const flaggedStudents = [
  { id: 1, name: "Alex M.", risk: "High", lastActive: "2 mins ago", mood: "😰", reason: "Expressed feelings of hopelessness", messages: 23, unread: 3, status: "active", resolvedToday: false },
  { id: 2, name: "Jordan K.", risk: "High", lastActive: "15 mins ago", mood: "😔", reason: "Screening score above threshold", messages: 45, unread: 1, status: "active", resolvedToday: false },
  { id: 3, name: "Sam R.", risk: "Moderate", lastActive: "1 hour ago", mood: "😐", reason: "Declining mood pattern over 5 days", messages: 18, unread: 0, status: "active", resolvedToday: false },
  { id: 4, name: "Taylor P.", risk: "Moderate", lastActive: "3 hours ago", mood: "😟", reason: "Reported sleep issues and stress", messages: 12, unread: 0, status: "active", resolvedToday: false },
  { id: 5, name: "Morgan L.", risk: "Low", lastActive: "1 day ago", mood: "😊", reason: "Follow-up from previous session", messages: 31, unread: 0, status: "active", resolvedToday: false },
];

type ChatMessage = {
  sender: "student" | "counselor" | "ai";
  text: string;
  time: string;
};

const initialMessagesByStudent: Record<number, ChatMessage[]> = {
  1: [
    { sender: "student", text: "Not great... I feel like nothing matters anymore.", time: "10:01 AM" },
    { sender: "ai", text: "I hear you, and I want you to know that your feelings are valid. Can you tell me more about what's been going on?", time: "10:01 AM" },
    { sender: "student", text: "School is overwhelming and I can't sleep.", time: "10:03 AM" },
  ],
  2: [
    { sender: "student", text: "I'm really anxious about my exams.", time: "09:40 AM" },
    { sender: "ai", text: "Your prep matters, but it also matters to rest. Would you like a short breathing exercise?", time: "09:41 AM" },
  ],
  3: [
    { sender: "student", text: "I feel stuck in a loop of bad days.", time: "08:20 AM" },
    { sender: "ai", text: "It's okay to ask for help. You're doing well by checking in.", time: "08:21 AM" },
  ],
  4: [
    { sender: "student", text: "I'm losing motivation to do anything.", time: "11:22 AM" },
    { sender: "ai", text: "Small steps are still progress. Would you like to talk through one thing at a time?", time: "11:23 AM" },
  ],
  5: [
    { sender: "student", text: "I feel much better after the last session.", time: "07:30 AM" },
    { sender: "ai", text: "I'm glad to hear that. Keep checking in with yourself.", time: "07:31 AM" },
  ],
};

const riskColor = (risk: string) => {
  if (risk === "High") return "bg-soft-rose text-soft-rose-foreground";
  if (risk === "Moderate") return "bg-warm-amber text-warm-amber-foreground";
  return "bg-soft-green text-soft-green-foreground";
};

type ScreeningRecord = {
  _id: string;
  userEmail: string;
  result: string;
  average: number;
  answers: number[];
  createdAt: string;
};

export default function CounselorDashboard() {
  const { user } = useAuth();
  const [students, setStudents] = useState(flaggedStudents);
  const [selectedId, setSelectedId] = useState(flaggedStudents[0]?.id ?? null);
  const [searchQuery, setSearchQuery] = useState("");
  const [actionMessage, setActionMessage] = useState("");
  const [messageInput, setMessageInput] = useState("");
  const [messagesByStudent, setMessagesByStudent] = useState<Record<number, ChatMessage[]>>(initialMessagesByStudent);
  const [screenings, setScreenings] = useState<ScreeningRecord[]>([]);
  const [loadingScreenings, setLoadingScreenings] = useState(true);
  const [selectedScreening, setSelectedScreening] = useState<ScreeningRecord | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const openDetails = (screening: ScreeningRecord) => {
    setSelectedScreening(screening);
    setIsDetailsOpen(true);
  };

  useEffect(() => {
    const fetchScreenings = async () => {
      if (!user || user.role !== 'counselor') return;
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('/api/screenings', {
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });
        if (res.ok) {
          const data = await res.json();
          setScreenings(data.screenings || []);
        }
      } catch (error) {
        console.error('Failed to load screening history:', error);
      } finally {
        setLoadingScreenings(false);
      }
    };
    fetchScreenings();
  }, [user]);

  const selectedStudent = students.find((s) => s.id === selectedId) ?? students[0] ?? null;

  if (user?.role !== 'counselor') {
    return (
      <div className="glass rounded-2xl p-8 text-center">
        <p className="text-xl font-semibold text-foreground">Access denied</p>
        <p className="text-sm text-muted-foreground mt-2">
          This area is only available to counselors. Please login with a counselor account to continue.
        </p>
      </div>
    );
  }

  const filtered = students
    .filter((s) => s.status !== 'resolved')
    .filter((s) => s.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const activeCases = students.filter((s) => s.status !== 'resolved').length;
  const highRisk = students.filter((s) => s.status !== 'resolved' && s.risk === 'High').length;
  const pendingReviews = students.filter((s) => s.status === 'escalated').length;
  const resolvedToday = students.filter((s) => s.resolvedToday).length;

  const handleMessageStudent = () => {
    if (!selectedStudent) return;
    setActionMessage(`Message sent to ${selectedStudent.name}.`);
  };

  const handleEscalateCase = () => {
    if (!selectedStudent) return;
    setStudents((prev) =>
      prev.map((student) =>
        student.id === selectedStudent.id
          ? { ...student, status: 'escalated' }
          : student
      )
    );
    setActionMessage(`Case escalated for ${selectedStudent.name}.`);
  };

  const handleMarkResolved = () => {
    if (!selectedStudent) return;
    const nextStudent = students.find((student) => student.id !== selectedStudent.id && student.status !== 'resolved');
    setStudents((prev) =>
      prev.map((student) =>
        student.id === selectedStudent.id
          ? { ...student, status: 'resolved', resolvedToday: true }
          : student
      )
    );
    setActionMessage(`Marked ${selectedStudent.name} as resolved.`);
    setSelectedId(nextStudent?.id ?? null);
  };

  const handleSendCounselorMessage = () => {
    if (!selectedStudent || !messageInput.trim()) return;
    const now = new Date();
    const timestamp = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    setMessagesByStudent((prev) => ({
      ...prev,
      [selectedStudent.id]: [
        ...(prev[selectedStudent.id] ?? []),
        { sender: "counselor", text: messageInput.trim(), time: timestamp },
      ],
    }));
    setMessageInput("");
    setActionMessage(`Message sent to ${selectedStudent.name}.`);
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Shield className="w-6 h-6 text-primary" /> Counselor Dashboard
        </h1>
        <p className="text-sm text-muted-foreground">Monitor flagged students and provide support</p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Active Cases", value: activeCases.toString(), color: "bg-calm-blue" },
          { label: "High Risk", value: highRisk.toString(), color: "bg-soft-rose" },
          { label: "Pending Reviews", value: pendingReviews.toString(), color: "bg-warm-amber" },
          { label: "Resolved Today", value: resolvedToday.toString(), color: "bg-soft-green" },
        ].map((stat) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-2xl p-4 text-center">
            <p className="text-2xl font-bold text-foreground">{stat.value}</p>
            <p className="text-xs text-muted-foreground">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-5 gap-4">
        {/* Student List */}
        <div className="lg:col-span-2 glass rounded-2xl p-4 space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search students..."
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-muted/50 border border-border/50 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div className="space-y-2 max-h-[500px] overflow-y-auto">
            {filtered.map((student) => (
              <button
                key={student.id}
                onClick={() => setSelectedId(student.id)}
                className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all ${
                  selectedStudent?.id === student.id ? "bg-primary/10 ring-1 ring-primary/20" : "hover:bg-muted"
                }`}
              >
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-lg flex-shrink-0">
                  {student.mood}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-foreground truncate">{student.name}</span>
                    {student.unread > 0 && (
                      <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground text-[10px] flex items-center justify-center">{student.unread}</span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{student.reason}</p>
                </div>
                <Badge className={`${riskColor(student.risk)} text-[10px] shrink-0`}>{student.risk}</Badge>
              </button>
            ))}
          </div>
        </div>

        {/* Detail Panel */}
        <div className="lg:col-span-3 space-y-4">
          {selectedStudent ? (
            <motion.div key={selectedStudent.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass rounded-2xl p-5">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-2xl">
                    {selectedStudent.mood}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">{selectedStudent.name}</h3>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" /> Last active {selectedStudent.lastActive}
                    </div>
                  </div>
                </div>
                <Badge className={`${riskColor(selectedStudent.risk)}`}>{selectedStudent.risk} Risk</Badge>
              </div>
              <div className="glass rounded-xl p-3 mb-4">
                <p className="text-xs text-muted-foreground">
                  <AlertTriangle className="w-3 h-3 inline mr-1" />
                  Flag reason: {selectedStudent.reason}
                </p>
              </div>
              <div className="flex flex-col gap-3">
                <div className="flex flex-wrap gap-2">
                  <Button onClick={handleMessageStudent} size="sm" className="gap-2 rounded-xl">
                    <MessageCircle className="w-4 h-4" /> Message Student
                  </Button>
                  <Button onClick={handleEscalateCase} size="sm" variant="outline" className="gap-2 rounded-xl">
                    Escalate Case
                  </Button>
                  <Button onClick={handleMarkResolved} size="sm" variant="ghost" className="gap-2 rounded-xl">
                    Mark Resolved
                  </Button>
                </div>
                {actionMessage && (
                  <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-3 text-sm text-emerald-700">
                    {actionMessage}
                  </div>
                )}
              </div>
            </motion.div>
          ) : (
            <div className="glass rounded-2xl p-6 text-center">
              <p className="text-lg font-semibold text-foreground">No active counselor cases</p>
              <p className="text-sm text-muted-foreground mt-2">All flagged students are resolved.</p>
            </div>
          )}

          <div className="glass rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Shield className="w-4 h-4 text-primary" /> Screening History
              </h4>
              {loadingScreenings && <span className="text-xs text-muted-foreground">Loading...</span>}
            </div>
            {screenings.length === 0 ? (
              <p className="text-sm text-muted-foreground">No screening history available yet.</p>
            ) : (
              <div className="space-y-3 overflow-x-auto">
                <div className="min-w-[650px]">
                  <div className="grid grid-cols-[1.5fr_1fr_1fr_1fr_auto] gap-4 text-xs uppercase tracking-[0.12em] text-muted-foreground border-b border-border/50 pb-2 mb-2">
                    <span>Date</span>
                    <span>Student</span>
                    <span>Result</span>
                    <span>Average</span>
                    <span>Action</span>
                  </div>
                  {screenings.slice(0, 6).map((screening) => (
                    <div key={screening._id} className="grid grid-cols-[1.5fr_1fr_1fr_1fr_auto] gap-4 py-3 border-b border-border/20 text-sm text-foreground items-center">
                      <span>{new Date(screening.createdAt).toLocaleString()}</span>
                      <span className="truncate text-muted-foreground">{screening.userEmail}</span>
                      <span className="font-medium capitalize">{screening.result}</span>
                      <span>{screening.average.toFixed(2)}</span>
                      <Button size="sm" variant="outline" onClick={() => openDetails(screening)} className="rounded-xl">
                        View details
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

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

          {/* Chat history */}
          <div className="glass rounded-2xl p-4">
            <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-primary" /> Student Chat
            </h4>
            {selectedStudent ? (
              <>
                <div className="space-y-3 max-h-[320px] overflow-y-auto pb-2">
                  {(messagesByStudent[selectedStudent.id] ?? []).map((msg, i) => (
                    <div key={i} className={`flex ${msg.sender === "counselor" ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[80%] px-3 py-2 rounded-2xl ${
                        msg.sender === "counselor"
                          ? "bg-primary text-primary-foreground rounded-tr-md"
                          : msg.sender === "student"
                          ? "bg-muted rounded-tl-md"
                          : "bg-slate-100 text-slate-900 rounded-tl-md"
                      }`}>
                        <p className="text-xs leading-relaxed">{msg.text}</p>
                        <span className="text-[10px] opacity-60 mt-1 block text-right">{msg.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex gap-2 flex-col sm:flex-row">
                  <input
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    placeholder="Type a message to the student..."
                    className="flex-1 rounded-2xl border border-border/50 bg-muted/70 px-4 py-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/20"
                  />
                  <Button onClick={handleSendCounselorMessage} size="sm" className="rounded-xl">
                    Send Message
                  </Button>
                </div>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">Select a student to begin chatting.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

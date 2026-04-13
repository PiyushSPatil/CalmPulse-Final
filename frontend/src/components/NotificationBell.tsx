import { useMemo, useState, type MouseEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, Heart, MessageCircle, AlertTriangle, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const mockNotifications = [
  {
    id: 1,
    type: "reminder",
    icon: Clock,
    title: "Daily mood check-in",
    desc: "How are you feeling today? Log your mood.",
    time: "Just now",
    read: false,
    priority: "medium",
    route: "/screening",
  },
  {
    id: 2,
    type: "chat",
    icon: MessageCircle,
    title: "AI Chat follow-up",
    desc: "Your AI buddy wants to check in on you.",
    time: "1h ago",
    read: false,
    priority: "high",
    route: "/chat",
  },
  {
    id: 3,
    type: "alert",
    icon: AlertTriangle,
    title: "Wellness tip",
    desc: "Try a 5-minute breathing exercise today.",
    time: "3h ago",
    read: true,
    priority: "high",
    route: "/resources",
  },
  {
    id: 4,
    type: "support",
    icon: Heart,
    title: "New resource available",
    desc: "Coping with exam stress — new guide added.",
    time: "1d ago",
    read: true,
    priority: "low",
    route: "/resources",
  },
];

const actionText: Record<string, string> = {
  reminder: "Log mood",
  chat: "Reply",
  alert: "View tip",
  support: "Open guide",
};

const typeLabel: Record<string, string> = {
  reminder: "Mood check",
  chat: "Chat follow-up",
  alert: "Wellness alert",
  support: "Resource",
};

export function NotificationBell() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState(mockNotifications);
  const [filter, setFilter] = useState<"all" | "unread" | "important">("all");

  const unreadCount = useMemo(() => notifications.filter((n) => !n.read).length, [notifications]);
  const importantCount = useMemo(
    () => notifications.filter((n) => n.priority === "high" && !n.read).length,
    [notifications],
  );

  const filteredNotifications = useMemo(() => {
    if (filter === "unread") return notifications.filter((n) => !n.read);
    if (filter === "important") return notifications.filter((n) => n.priority === "high");
    return notifications;
  }, [filter, notifications]);

  const summary = useMemo(() => {
    const chatCount = notifications.filter((n) => n.type === "chat").length;
    const alertCount = notifications.filter((n) => n.type === "alert").length;
    return `${unreadCount} unread • ${chatCount} follow-up${chatCount === 1 ? "" : "s"} • ${alertCount} alert${alertCount === 1 ? "" : "s"} • ${importantCount} important`;
  }, [notifications, unreadCount, importantCount]);

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const openNotification = (id: number, route: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    setOpen(false);
    navigate(route);
  };

  const handleAction = (event: MouseEvent<HTMLButtonElement>, id: number, route: string) => {
    event.stopPropagation();
    openNotification(id, route);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative w-10 h-10 rounded-xl glass flex items-center justify-center hover:bg-muted transition-colors"
      >
        <Bell className="w-5 h-5 text-foreground" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className="absolute right-0 top-12 w-80 glass-strong rounded-2xl border border-border/50 shadow-lg z-50 overflow-hidden"
            >
              <div className="px-4 py-3 border-b border-border/50">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">Smart notifications</h3>
                    <p className="text-[11px] text-muted-foreground mt-1">{summary}</p>
                  </div>
                  <button onClick={markAllRead} className="text-xs text-primary hover:underline">
                    Mark all read
                  </button>
                </div>
                <div className="mt-3 flex flex-wrap gap-2 text-[11px] text-muted-foreground">
                  {(["all", "unread", "important"] as const).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => setFilter(mode)}
                      className={`rounded-full border px-2 py-1 transition ${
                        filter === mode ? "border-primary bg-primary/10 text-primary" : "border-border/50 bg-muted"
                      }`}
                    >
                      {mode === "all" ? "All" : mode === "unread" ? "Unread" : "Important"}
                    </button>
                  ))}
                </div>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {filteredNotifications.length === 0 ? (
                  <div className="p-4 text-center text-sm text-muted-foreground">No notifications here. Nice work!</div>
                ) : (
                  filteredNotifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => openNotification(n.id, n.route)}
                      className={`cursor-pointer flex items-start gap-3 px-4 py-3 border-b border-border/30 transition-colors ${
                        !n.read ? "bg-primary/5 hover:bg-primary/10" : "bg-transparent hover:bg-muted"
                      }`}
                    >
                      <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center flex-shrink-0 mt-0.5">
                        <n.icon className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-xs font-semibold text-foreground">{n.title}</p>
                          <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] uppercase tracking-[0.08em] text-muted-foreground">
                            {typeLabel[n.type]}
                          </span>
                        </div>
                        <p className="text-[11px] text-muted-foreground mt-1">{n.desc}</p>
                        <p className="text-[10px] text-muted-foreground mt-2">{n.time}</p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        {!n.read && <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />}
                        <button
                          onClick={(event) => handleAction(event, n.id, n.route)}
                          className="rounded-full border border-border/50 bg-muted px-3 py-1 text-[10px] font-medium text-foreground hover:border-primary hover:text-primary"
                        >
                          {actionText[n.type]}
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

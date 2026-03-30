import { motion } from "framer-motion";
import { BarChart3, Users, Activity, TrendingUp, Download, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";

const weeklyUsage = [
  { day: "Mon", sessions: 120, chats: 85 },
  { day: "Tue", sessions: 145, chats: 102 },
  { day: "Wed", sessions: 160, chats: 118 },
  { day: "Thu", sessions: 132, chats: 95 },
  { day: "Fri", sessions: 178, chats: 140 },
  { day: "Sat", sessions: 65, chats: 42 },
  { day: "Sun", sessions: 50, chats: 30 },
];

const stressTrend = [
  { week: "W1", avg: 3.2 },
  { week: "W2", avg: 3.5 },
  { week: "W3", avg: 3.1 },
  { week: "W4", avg: 2.8 },
  { week: "W5", avg: 2.6 },
  { week: "W6", avg: 2.9 },
];

const riskDistribution = [
  { name: "Low", value: 68, color: "hsl(150, 45%, 50%)" },
  { name: "Moderate", value: 24, color: "hsl(35, 70%, 55%)" },
  { name: "High", value: 8, color: "hsl(340, 50%, 55%)" },
];

const topConcerns = [
  { concern: "Academic Stress", count: 342, pct: 38 },
  { concern: "Anxiety", count: 256, pct: 28 },
  { concern: "Sleep Issues", count: 178, pct: 20 },
  { concern: "Loneliness", count: 124, pct: 14 },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-primary" /> Admin Dashboard
          </h1>
          <p className="text-sm text-muted-foreground">Campus-wide mental wellness analytics</p>
        </div>
        <Button variant="outline" className="gap-2 rounded-xl">
          <Download className="w-4 h-4" /> Export Report
        </Button>
      </motion.div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Total Users", value: "1,247", change: "+12%", icon: Users, color: "bg-calm-blue" },
          { label: "Active Today", value: "186", change: "+8%", icon: Activity, color: "bg-soft-green" },
          { label: "Avg. Stress Level", value: "2.9/5", change: "-4%", icon: TrendingUp, color: "bg-lavender" },
          { label: "Escalations", value: "12", change: "+2", icon: Filter, color: "bg-soft-rose" },
        ].map((card) => (
          <motion.div key={card.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-2xl p-4">
            <div className="flex items-center justify-between mb-2">
              <div className={`w-9 h-9 rounded-xl ${card.color} flex items-center justify-center`}>
                <card.icon className="w-4 h-4" />
              </div>
              <span className="text-xs font-medium text-soft-green-foreground">{card.change}</span>
            </div>
            <p className="text-xl font-bold text-foreground">{card.value}</p>
            <p className="text-xs text-muted-foreground">{card.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        {/* Usage Chart */}
        <div className="glass rounded-2xl p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">Weekly Platform Usage</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={weeklyUsage}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 20% 90%)" />
              <XAxis dataKey="day" tick={{ fontSize: 11 }} stroke="hsl(220 15% 50%)" />
              <YAxis tick={{ fontSize: 11 }} stroke="hsl(220 15% 50%)" />
              <Tooltip contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }} />
              <Bar dataKey="sessions" fill="hsl(230 70% 58%)" radius={[6, 6, 0, 0]} name="Sessions" />
              <Bar dataKey="chats" fill="hsl(260 55% 75%)" radius={[6, 6, 0, 0]} name="AI Chats" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Stress Trend */}
        <div className="glass rounded-2xl p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">Campus Stress Trend (6 weeks)</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={stressTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 20% 90%)" />
              <XAxis dataKey="week" tick={{ fontSize: 11 }} stroke="hsl(220 15% 50%)" />
              <YAxis domain={[0, 5]} tick={{ fontSize: 11 }} stroke="hsl(220 15% 50%)" />
              <Tooltip contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }} />
              <Line type="monotone" dataKey="avg" stroke="hsl(230 70% 58%)" strokeWidth={2.5} dot={{ r: 4, fill: "hsl(230 70% 58%)" }} name="Avg Stress" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Risk Distribution */}
        <div className="glass rounded-2xl p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">Risk Level Distribution</h3>
          <div className="flex items-center gap-6">
            <ResponsiveContainer width={140} height={140}>
              <PieChart>
                <Pie data={riskDistribution} cx="50%" cy="50%" innerRadius={40} outerRadius={65} paddingAngle={3} dataKey="value">
                  {riskDistribution.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2">
              {riskDistribution.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-sm text-foreground font-medium">{item.name}</span>
                  <span className="text-xs text-muted-foreground">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Concerns */}
        <div className="glass rounded-2xl p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">Top Reported Concerns</h3>
          <div className="space-y-3">
            {topConcerns.map((item) => (
              <div key={item.concern} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-foreground font-medium">{item.concern}</span>
                  <span className="text-muted-foreground text-xs">{item.count} reports</span>
                </div>
                <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${item.pct}%` }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                    className="h-full rounded-full bg-primary"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

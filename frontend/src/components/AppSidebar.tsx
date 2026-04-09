import { NavLink } from "@/components/NavLink";
import { useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  MessageCircle,
  ClipboardList,
  BookOpen,
  LogIn,
  LogOut,
  Heart,
  Menu,
  X,
  Shield,
  BarChart3,
} from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";

const defaultNav = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard, roles: ['student', 'counselor'] },
  { title: "AI Chat", url: "/chat", icon: MessageCircle, roles: ['student', 'counselor'] },
  { title: "Screening", url: "/screening", icon: ClipboardList, roles: ['student', 'counselor'] },
  { title: "Resources", url: "/resources", icon: BookOpen, roles: ['student', 'counselor'] },
  { title: "Counselor", url: "/counselor", icon: Shield, roles: ['counselor'] },
  { title: "Admin", url: "/admin", icon: BarChart3, roles: ['admin'] },
];

export function AppSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout } = useAuth();
  const role = user?.role || 'student';
  const navItems = defaultNav.filter((item) => item.roles.includes(role));
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setCollapsed(true)}
          />
        )}
      </AnimatePresence>

      {/* Mobile toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="fixed top-4 left-4 z-50 lg:hidden w-10 h-10 rounded-xl glass flex items-center justify-center"
      >
        {collapsed ? <Menu className="w-5 h-5" /> : <X className="w-5 h-5" />}
      </button>

      <aside
        className={`fixed top-0 left-0 h-full z-50 glass-strong border-r border-border/50 transition-all duration-300 flex flex-col
          ${collapsed ? "-translate-x-full lg:translate-x-0 lg:w-16" : "w-56 translate-x-0"}
        `}
      >
        {/* Logo */}
        <div
          className="flex items-center gap-2 px-4 py-5 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center flex-shrink-0">
            <Heart className="w-5 h-5 text-primary-foreground" />
          </div>
          {!collapsed && (
            <span className="text-lg font-bold text-foreground tracking-tight">
              CalmPulse
            </span>
          )}
        </div>

        {/* Nav items */}
        <nav className="flex-1 px-2 py-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.url}
              to={item.url}
              end
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
                ${collapsed ? "justify-center lg:justify-center" : ""}
                text-muted-foreground hover:text-foreground hover:bg-muted
              `}
              activeClassName="bg-primary/10 text-primary hover:bg-primary/10 hover:text-primary"
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && <span>{item.title}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Bottom */}
        <div className="px-2 pb-4">
          {user ? (
            <button
              onClick={() => {
                logout();
                navigate("/login");
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-all text-left"
            >
              <LogOut className="w-5 h-5 flex-shrink-0" />
              {!collapsed && <span>Logout</span>}
            </button>
          ) : (
            <NavLink
              to="/login"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
              activeClassName="bg-primary/10 text-primary"
            >
              <LogIn className="w-5 h-5 flex-shrink-0" />
              {!collapsed && <span>Login</span>}
            </NavLink>
          )}
        </div>

        {/* Desktop collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden lg:flex items-center justify-center py-3 border-t border-border/50 text-muted-foreground hover:text-foreground transition-colors"
        >
          <Menu className="w-4 h-4" />
        </button>
      </aside>
    </>
  );
}

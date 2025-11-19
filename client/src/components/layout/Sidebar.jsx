// src/components/Sidebar.jsx
import { Home, MessageSquare, BookOpen, CalendarCheck, Settings, LogOut, Plus } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Link, useLocation, useNavigate } from "react-router-dom";

const menuItems = [
  { icon: Home, label: "Dashboard", href: "/dashboard" },
  { icon: MessageSquare, label: "AI Chat", href: "/chat" },
  { icon: BookOpen, label: "Notes", href: "/notes" },
  { icon: CalendarCheck, label: "Attendance", href: "/attendance" },
  { icon: Settings, label: "Settings", href: "/profile" },
];

export function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="hidden md:flex flex-col w-64 h-full bg-card/50 backdrop-blur-xl border-r border-border/50 z-10">

      {/* Logo */}
      <div className="p-6">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          EduNexus
        </h2>
      </div>

      <nav className="flex-1 px-4 overflow-y-auto">
        {/* My Courses */}
        <div className="space-y-2 mb-8">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs uppercase text-muted-foreground">My Courses</p>
            <Plus className="w-4 h-4 text-muted-foreground cursor-pointer hover:text-foreground transition" />
          </div>
          {["Calculus III", "Physics II", "Data Structures"].map((course) => (
            <div
              key={course}
              className="flex items-center justify-between py-3 px-4 rounded-xl hover:bg-white/5 transition cursor-pointer"
            >
              <span className="text-sm">{course}</span>
              <span className="text-xs text-emerald-400">94%</span>
            </div>
          ))}
        </div>

        {/* Main Menu */}
        <div className="space-y-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.label}
                to={item.href}
                className={`flex items-center gap-4 py-3 px-4 rounded-xl transition-all ${
                  isActive
                    ? "bg-primary/10 text-primary font-medium"
                    : "hover:bg-white/10 text-muted-foreground hover:text-foreground"
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* User Profile & Logout */}
      <div className="p-6 border-t border-border/50">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarFallback>KN</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="font-medium">Knight</p>
            <p className="text-xs text-muted-foreground">knight@college.edu</p>
          </div>
          <button
            onClick={handleLogout}
            className="p-2 hover:bg-white/10 rounded-lg transition"
            title="Logout"
          >
            <LogOut className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>
      </div>
    </div>
  );
}
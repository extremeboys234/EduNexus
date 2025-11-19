import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
// import { Progress } from "@/components/ui/progress"
import { AlertCircle, TrendingUp, Sparkles, CalendarCheck } from "lucide-react"
import { motion } from "framer-motion"

import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../providers/AuthProvider";
// import { logout as logoutAPI } from "../features/auth/services/authApi";
import { useNavigate } from "react-router-dom";
// import "../assets/styles/Home.css";

const Dashboard = () => {
  const logout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };
  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-4xl font-bold mb-2">Good evening, Knight</h1>
        <p className="text-muted-foreground mb-10">You're crushing it - keep going</p>

        {/* Attendance Hero */}
        <div className="glass-card p-8 mb-8 premium-gradient">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm">Overall Attendance</p>
              <p className="text-5xl font-bold mt-2">92%</p>
              <p className="text-amber-400 flex items-center gap-2 mt-3">
                <AlertCircle className="w-5 h-5" />
                2 more misses → below 75%
              </p>
            </div>
            <div className="relative w-40 h-40">
              <svg className="transform -rotate-90 w-40 h-40">
                <circle cx="80" cy="80" r="70" stroke="hsl(240,20%,15%)" strokeWidth="16" fill="none" />
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  stroke="url(#gradient)"
                  strokeWidth="16"
                  fill="none"
                  strokeDasharray={`${4.4 * 92} 3600`}
                  className="transition-all duration-1000"
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#a855f7" />
                    <stop offset="100%" stopColor="#6366f1" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-4xl font-bold">92%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <Card className="glass-card p-8 hover:scale-105 transition cursor-pointer">
            <Sparkles className="w-10 h-10 text-primary mb-4" />
            <h3 className="text-xl font-semibold">Ask AI Anything</h3>
            <p className="text-muted-foreground mt-2">Instant help with today's material</p>
            <Button className="mt-6 w-full bg-primary hover:bg-primary/90">Open Chat</Button>
          </Card>

          <Card className="glass-card p-8 hover:scale-105 transition cursor-pointer">
            <TrendingUp className="w-10 h-10 text-emerald-400 mb-4" />
            <h3 className="text-xl font-semibold">Practice Set</h3>
            <p className="text-muted-foreground mt-2">20 new questions on Taylor Series</p>
            <Button variant="outline" className="mt-6 w-full">Start Now</Button>
          </Card>

          <Card className="glass-card p-8 hover:scale-105 transition cursor-pointer">
            <CalendarCheck className="w-10 h-10 text-amber-400 mb-4" />
            <h3 className="text-xl font-semibold">Next Class</h3>
            <p className="text-lg font-medium mt-2">Calculus III</p>
            <p className="text-muted-foreground">Mon Nov 24 · 10:00 AM · Room 301 · <span className="text-red-400">REQUIRED</span></p>
          </Card>
        </div>

        {/* Recent Notes */}
        <h2 className="text-2xl font-bold mb-6">Recent Notes</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[1,2,3,4].map((i) => (
            <div key={i} className="glass-card aspect-video cursor-pointer hover:ring-2 ring-primary transition">
              <div className="bg-gradient-to-br from-primary/30 to-secondary/30 rounded-t-2xl h-32" />
              <div className="p-4">
                <p className="font-medium">Taylor Series Lecture</p>
                <p className="text-xs text-muted-foreground">Nov 18, 2025</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

export default Dashboard;
import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Loader2,
  Sparkles,
  ArrowRight,
  Mail,
  Lock,
  GraduationCap,
  User,
} from "lucide-react";
import { motion } from "framer-motion";
import { RadioGroup, RadioGroupItem } from "@radix-ui/react-radio-group";

const Signup = () => {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [role, setRole] = useState("student");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const payload = { name, email, password, role };
      const res = await axios.post("http://localhost:5000/api/auth/signup", payload);

      // store token and navigate
      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch (err) {
      alert(err?.response?.data?.message || "Signup failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6 relative overflow-hidden">
      {/* Same animated background as login */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 -left-40 w-96 h-96 bg-primary/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 -right-40 w-96 h-96 bg-secondary/30 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-primary/20 rounded-full blur-3xl" />
      </div>

      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-12">
          <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="inline-flex items-center gap-3 mb-6">
            <div className="w-14 h-14 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center shadow-2xl">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
          </motion.div>

          <h1 className="text-5xl font-bold bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent animate-gradient-x">
            EduNexus
          </h1>
          <p className="text-xl text-muted-foreground mt-4">
            {step === 1 ? "Join 50,000+ students crushing exams" : "Welcome to the future of studying"}
          </p>
        </div>

        <Card className="glass-card border-0 shadow-3xl backdrop-blur-2xl p-8">
          {/* Step 1: Role Selection */}
          {step === 1 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-center mb-2">Who are you?</h2>
                <p className="text-muted-foreground text-center">Choose your role to get started</p>
              </div>

              <RadioGroup value={role} onValueChange={(v) => setRole(v)} className="grid grid-cols-1 gap-6" aria-label="Select role">
                <Label
                  htmlFor="student"
                  className={`flex flex-col items-center justify-between p-10 rounded-3xl border-2 cursor-pointer transition-all glass-card hover:ring-4 ring-primary/30
                    ${role === "student" ? "border-primary bg-primary/10" : "border-border"}`}
                >
                  <RadioGroupItem value="student" id="student" className="sr-only" />
                  <GraduationCap className="w-16 h-16 mb-4 text-primary" />
                  <span className="text-2xl font-bold">Student</span>
                  <span className="text-muted-foreground text-center mt-2">Upload notes · AI practice · Never miss class</span>
                </Label>

                <Label
                  htmlFor="teacher"
                  className={`flex flex-col items-center justify-between p-10 rounded-3xl border-2 cursor-pointer transition-all glass-card hover:ring-4 ring-primary/30
                    ${role === "teacher" ? "border-primary bg-primary/10" : "border-border"}`}
                >
                  <RadioGroupItem value="teacher" id="teacher" className="sr-only" />
                  <User className="w-16 h-16 mb-4 text-secondary" />
                  <span className="text-2xl font-bold">Teacher</span>
                  <span className="text-muted-foreground text-center mt-2">Upload question banks · Auto attendance · Analytics</span>
                </Label>
              </RadioGroup>

              <Button
                size="lg"
                className="w-full h-14 text-lg bg-gradient-to-r from-primary to-secondary"
                onClick={() => setStep(2)}
              >
                Continue as {role === "student" ? "Student" : "Teacher"}
                <ArrowRight className="ml-3 h-5 w-5" />
              </Button>
            </motion.div>
          )}

          {/* Step 2: Email + Name */}
          {step === 2 && (
            <motion.form initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-5">
                <div className="space-y-2">
                  <Label>Full Name</Label>
                  <Input
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="h-14 bg-white/5 border-white/10 focus:border-primary/50"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Email {role === "student" ? "(use .edu if possible)" : ""}</Label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-4 w-5 h-5 text-muted-foreground" />
                    <Input
                      type="email"
                      placeholder={role === "student" ? "knight@stanford.edu" : "prof.chen@university.edu"}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="pl-12 h-14 bg-white/5 border-white/10 focus:border-primary/50"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Password</Label>
                  <Input
                    type="password"
                    placeholder="Create a strong password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="h-14 bg-white/5 border-white/10 focus:border-primary/50"
                  />
                </div>
              </div>

              <Button type="submit" disabled={isLoading} size="lg" className="w-full h-14 text-lg font-medium bg-gradient-to-r from-primary to-secondary shadow-xl">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                    Creating your account...
                  </>
                ) : (
                  <>
                    Create Account
                    <ArrowRight className="ml-3 h-5 w-5" />
                  </>
                )}
              </Button>

              <p className="text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link to="/login" className="text-primary font-semibold hover:underline">
                  Sign in
                </Link>
              </p>
            </motion.form>
          )}
        </Card>

        {/* Footer */}
        <div className="mt-12 text-center">
          <p className="text-xs text-muted-foreground">
            By signing up, you agree to our{" "}
            <span className="text-primary underline cursor-pointer">Terms</span> and{" "}
            <span className="text-primary underline cursor-pointer">Privacy Policy</span>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Signup;

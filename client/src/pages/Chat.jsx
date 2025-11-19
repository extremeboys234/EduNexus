// src/pages/ChatPage.jsx  (replace existing file contents)
import { useEffect, useRef, useState } from "react";
import { Send, Paperclip, Copy, ThumbsUp, ThumbsDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import confetti from "canvas-confetti";
import { motion } from "framer-motion";
import MarkdownRenderer from "@/components/MarkdownRenderer";

// Quick actions
const quickActions = [
  "Explain like I'm 14",
  "Make 10 MCQs",
  "Summarize last lecture",
  "Find weak spots",
  "Create flashcard deck",
];

// Demo attachment (local path you uploaded)
const DEMO_ATTACHMENT_URL = "/mnt/data/d241a2c0-afe8-47f8-8bd8-a41f0c479efa.png";

export default function ChatPage() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hey Knight! Ready to crush Calculus today? 🚀 What do you want to master?",
      sources: [],
      ts: Date.now(),
    },
  ]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [attachment, setAttachment] = useState(null);
  const messagesRef = useRef(null);

  // auto-scroll to bottom when messages change
  useEffect(() => {
    const el = messagesRef.current;
    if (!el) return;
    // smooth scroll to bottom
    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const pushMessage = (msg) => setMessages((p) => [...p, { ...msg, ts: Date.now() }]);
  const copyToClipboard = async (text) => { try { await navigator.clipboard.writeText(text); } catch {} };
// inside ChatPage (replace existing handleSend logic)
/* const handleSend = async () => {
  if (!input.trim()) return;
  const userText = input.trim();
  pushMessage({ role: "user", content: userText });
  setInput("");
  pushMessage({ role: "assistant", content: "Thinking...", _temp: true });

  try {
    const token = localStorage.getItem("token"); // your JWT
    const res = await fetch("/api/chat/rag", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ message: userText, topK: 6 })
    });
    const data = await res.json();
    setMessages((prev) => {
      const filtered = prev.filter((m) => !m._temp);
      return [...filtered, { role: "assistant", content: data.answer, sources: data.sources || [] }];
    });
  } catch (e) {
    setMessages((prev) => {
      const filtered = prev.filter((m) => !m._temp);
      return [...filtered, { role: "assistant", content: "AI unreachable.", sources: [] }];
    });
  }
}; */

  const handleSend = async () => {
    if (!input.trim() && !attachment) return;
    const userText = input.trim() || (attachment ? `Uploaded file: ${attachment.name}` : "");
    pushMessage({ role: "user", content: userText });
    setInput("");
    setAttachment(null);
    pushMessage({ role: "assistant", content: "Thinking...", _temp: true });
    setSending(true);

    try {
      const res = await fetch("http://localhost:5000/api/chat/simple", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userText }),
      });
      const data = await res.json();
      const answer = data?.answer || "Sorry, AI gave no reply.";

      setMessages((prev) => {
        const filtered = prev.filter((m) => !m._temp);
        return [...filtered, { role: "assistant", content: answer, sources: [], ts: Date.now() }];
      });

      if (userText.toLowerCase().includes("mcq") || userText.toLowerCase().includes("practice")) {
        confetti({ particleCount: 80, spread: 60 });
      }
    } catch {
      setMessages((prev) => {
        const filtered = prev.filter((m) => !m._temp);
        return [...filtered, { role: "assistant", content: "AI unreachable.", sources: [], ts: Date.now() }];
      });
    } finally {
      setSending(false);
    }
  };

  const onQuickAction = (text) => setInput(text);
  const attachDemoFile = () => setAttachment({ url: DEMO_ATTACHMENT_URL, name: "screenshot.png" });

  return (
    // NOTE: do NOT use h-screen here — parent layout controls height
    <div className="flex flex-col h-full min-h-0 bg-background text-foreground">
      {/* Header */}
      <div className="glass-card border-b border-border/50 px-6 py-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Taylor Series Mastery</h2>
          <p className="text-sm text-muted-foreground">Calculus III · Knight</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-sm text-muted-foreground hidden md:block">Active • AI Tutor</div>
          <Button variant="outline" size="sm">Share</Button>
        </div>
      </div>

      {/* Messages area: THIS is the only scrollable region */}
      <div
        ref={messagesRef}
        className="flex-1 overflow-y-auto px-6 py-6 min-h-0"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        <div className="max-w-4xl mx-auto">
          {messages.map((msg, i) => {
            const isUser = msg.role === "user";
            const bubbleClasses = isUser
              ? "bg-primary text-primary-foreground rounded-2xl rounded-br-sm px-5 py-3 shadow-md"
              : "glass-card px-6 py-4 rounded-2xl shadow-sm";

            return (
              <div key={i} className={`mb-6 flex ${isUser ? "justify-end" : "justify-start"}`}>
                <div className={`flex items-end gap-4 max-w-3xl ${isUser ? "flex-row-reverse" : ""}`}>
                  {!isUser ? (
                    <Avatar><AvatarFallback className="bg-primary text-primary-foreground">AI</AvatarFallback></Avatar>
                  ) : (
                    <Avatar><AvatarFallback>KN</AvatarFallback></Avatar>
                  )}

                  <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className={`${bubbleClasses} w-full`}>
                    {/* <div className="whitespace-pre-wrap break-words text-sm leading-6">{msg.content}</div> */}
                    {/* <MarkdownRenderer>{msg.content}</MarkdownRenderer> */}
                    {/* <div className="whitespace-pre-wrap break-words text-sm leading-6 text-foreground">
                    {typeof msg.content === 'string' && msg.content.trim().length > 0 ? msg.content : <i className="text-muted-foreground">{'<empty message>'}</i>}
                  </div> */}
                    <MarkdownRenderer content={msg.content} onImageClick={(src) => window.open(src, "_blank")} />


                    {msg._temp && (
                      <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                        <div className="flex gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-muted animate-pulse" />
                          <span className="w-1.5 h-1.5 rounded-full bg-muted animate-pulse delay-75" />
                          <span className="w-1.5 h-1.5 rounded-full bg-muted animate-pulse delay-150" />
                        </div>
                        <span>Generating...</span>
                      </div>
                    )}

                    {!msg._temp && msg.sources && msg.sources.length > 0 && (
                      <div className="mt-4">
                        <Accordion type="single" collapsible>
                          <AccordionItem value={`s-${i}`} className="border-border/30">
                            <AccordionTrigger className="text-sm">Show Sources ({msg.sources.length})</AccordionTrigger>
                            <AccordionContent>
                              <div className="space-y-2">
                                {msg.sources.map((s, idx) => (
                                  <div key={idx} className="py-2 text-sm opacity-80">{s}</div>
                                ))}
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                      </div>
                    )}

                    {!isUser && !msg._temp && (
                      <div className="flex gap-2 mt-4">
                        <Button variant="ghost" size="icon" onClick={() => copyToClipboard(msg.content)}><Copy className="w-4 h-4" /></Button>
                        <Button variant="ghost" size="icon" onClick={() => confetti({ particleCount: 30 })}><ThumbsUp className="w-4 h-4" /></Button>
                        <Button variant="ghost" size="icon" onClick={() => {}}><ThumbsDown className="w-4 h-4" /></Button>
                      </div>
                    )}
                  </motion.div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick actions */}
      <div className="px-6 py-3 border-t border-border/50 bg-background/50">
        <div className="max-w-4xl mx-auto flex items-center gap-3 overflow-x-auto py-2">
          {quickActions.map((q) => (
            <Button key={q} variant="outline" size="sm" onClick={() => onQuickAction(q)}>{q}</Button>
          ))}
          <div className="flex-1" />
          <Button variant="ghost" size="sm" onClick={attachDemoFile}>Attach demo</Button>
        </div>
      </div>

      {/* Composer */}
      <div className="glass-card border-t border-border/50 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <Button variant="ghost" size="icon"><Paperclip /></Button>

          <div className="flex-1">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
              placeholder="Ask something or request practice..."
              className="min-h-[44px] resize-none bg-transparent border-border"
            />

            {attachment && (
              <div className="mt-3 p-3 rounded-lg bg-surface border border-border flex items-center gap-4">
                <img src={attachment.url} alt={attachment.name} className="w-20 h-12 object-cover rounded" />
                <div className="flex-1">
                  <div className="font-medium">{attachment.name}</div>
                  <div className="text-xs text-muted-foreground">Demo attachment (local)</div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setAttachment(null)}>Remove</Button>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon"><svg className="w-5 h-5" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="1.5"/></svg></Button>
            <Button size="icon" onClick={handleSend} className="bg-primary hover:bg-primary/90"><Send className="w-5 h-5 text-primary-foreground" /></Button>
          </div>
        </div>
      </div>
    </div>
  );
}

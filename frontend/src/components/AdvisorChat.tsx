import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, User, Sparkles, X, BookOpen } from "lucide-react";
import { useAuthStore } from "../lib/store";

const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3001";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  streaming?: boolean;
}

const SUGGESTED = [
  "What do stress scores above 4 mean for my team?",
  "How should I approach a 1:1 with someone scoring low?",
  "What does the research say about burnout detection?",
  "How do I interpret a sudden drop in team mood?",
  "What's the difference between mental load and stress?",
];

export default function AdvisorChat() {
  const { user, token } = useAuthStore();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: `Hi ${user?.name?.split(" ")[0] ?? "there"} 👋 I'm your Mindly wellbeing advisor, grounded in workplace psychology research. Ask me anything about your team's check-in data, how to interpret scores, or how to support someone who's struggling.`,
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = async (text: string) => {
    if (!text.trim() || loading) return;
    setInput("");

    const userMsg: Message = { id: crypto.randomUUID(), role: "user", content: text };
    const assistantId = crypto.randomUUID();
    const assistantMsg: Message = { id: assistantId, role: "assistant", content: "", streaming: true };

    setMessages((prev) => [...prev, userMsg, assistantMsg]);
    setLoading(true);

    // Build history: exclude the static welcome message, include everything else + new user msg
    const history = [...messages, userMsg]
      .filter((m) => m.id !== "welcome" && !m.streaming)
      .map((m) => ({ role: m.role, content: m.content }))
      .filter((m) => m.content.trim().length > 0);

    // Must have at least the user message
    if (history.length === 0) {
      history.push({ role: "user", content: text });
    }

    const stopStreaming = (id: string, errorMsg?: string) => {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === id
            ? { ...m, streaming: false, ...(errorMsg ? { content: `⚠️ ${errorMsg}` } : {}) }
            : m
        )
      );
    };

    try {
      const res = await fetch(`${BASE_URL}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "x-demo-role": user?.role ?? "manager",
        },
        body: JSON.stringify({ messages: history }),
      });

      if (!res.ok) {
        const errText = await res.text().catch(() => `HTTP ${res.status}`);
        throw new Error(errText);
      }

      if (!res.body) throw new Error("No stream");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          try {
            const data = JSON.parse(line.slice(6));
            if (data.text) {
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantId ? { ...m, content: m.content + data.text } : m
                )
              );
            }
            if (data.error) {
              stopStreaming(assistantId, data.error);
            }
          } catch {}
        }
      }

      // Stream finished — clear streaming flag
      stopStreaming(assistantId);
    } catch (err: any) {
      console.error("Chat error:", err);
      stopStreaming(assistantId, "Could not reach the advisor. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send(input);
    }
  };

  return (
    <>
      {/* Floating button */}
      <motion.button
        onClick={() => setOpen(true)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        className="fixed bottom-24 right-4 z-40 w-14 h-14 rounded-full bg-primary-600 text-white shadow-glow flex items-center justify-center md:bottom-6"
        aria-label="Open AI advisor"
      >
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <Sparkles size={22} />
        </motion.div>
      </motion.button>

      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            className="fixed bottom-24 right-4 z-50 w-[min(420px,calc(100vw-2rem))] h-[min(600px,calc(100vh-8rem))] bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-gray-100 md:bottom-6"
          >
            {/* Header */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100 bg-gradient-to-r from-primary-50 to-violet-50">
              <div className="w-9 h-9 rounded-2xl bg-primary-600 flex items-center justify-center shrink-0">
                <Bot size={18} className="text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-800 text-sm">Mindly Advisor</p>
                <p className="text-[10px] text-gray-400 flex items-center gap-1">
                  <BookOpen size={9} /> Grounded in workplace psychology research
                </p>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 scrollbar-hide">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-2.5 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
                >
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                      msg.role === "assistant" ? "bg-primary-100" : "bg-gray-100"
                    }`}
                  >
                    {msg.role === "assistant"
                      ? <Bot size={14} className="text-primary-600" />
                      : <User size={14} className="text-gray-500" />
                    }
                  </div>
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "bg-primary-600 text-white rounded-tr-sm"
                        : "bg-gray-50 text-gray-700 rounded-tl-sm border border-gray-100"
                    }`}
                  >
                    {msg.content}
                    {msg.streaming && (
                      <motion.span
                        animate={{ opacity: [1, 0, 1] }}
                        transition={{ duration: 0.8, repeat: Infinity }}
                        className="inline-block w-1.5 h-3.5 bg-primary-400 rounded-sm ml-1 align-middle"
                      />
                    )}
                  </div>
                </motion.div>
              ))}
              <div ref={bottomRef} />
            </div>

            {/* Suggestions (only when no user messages yet) */}
            {messages.length === 1 && (
              <div className="px-4 pb-2 flex flex-wrap gap-1.5">
                {SUGGESTED.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="text-[11px] bg-primary-50 text-primary-600 px-2.5 py-1 rounded-full hover:bg-primary-100 transition-colors font-medium"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div className="px-4 pb-4 pt-2 border-t border-gray-100">
              <div className="flex gap-2 items-end bg-gray-50 rounded-2xl px-4 py-2.5 border border-gray-200 focus-within:border-primary-300 focus-within:ring-2 focus-within:ring-primary-100 transition-all">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKey}
                  placeholder="Ask about your team's wellbeing…"
                  rows={1}
                  className="flex-1 bg-transparent text-sm text-gray-700 placeholder-gray-400 resize-none focus:outline-none leading-relaxed max-h-24"
                  style={{ scrollbarWidth: "none" }}
                />
                <motion.button
                  onClick={() => send(input)}
                  disabled={!input.trim() || loading}
                  whileTap={{ scale: 0.9 }}
                  className="w-8 h-8 rounded-xl bg-primary-600 text-white flex items-center justify-center disabled:opacity-40 transition-opacity shrink-0"
                >
                  <Send size={14} />
                </motion.button>
              </div>
              <p className="text-[10px] text-gray-300 text-center mt-1.5">
                Based on Zaki et al. (2009) · Rehmatullah & Ickes
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

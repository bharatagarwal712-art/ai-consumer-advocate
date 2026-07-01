"use client";

import { useEffect, useRef, useState } from "react";
import { Send, Zap, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ChatBubble from "@/components/ChatBubble";
import TweetPanel from "@/components/TweetPanel";
import { signIn, signOut, useSession } from "next-auth/react";

interface Message {
  role: string;
  content: string;
}

/* ──────────────────────────────────
   Loading Skeleton
   ────────────────────────────────── */
function LoadingScreen() {
  return (
    <main className="min-h-dvh flex items-center justify-center relative z-10">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center gap-4"
      >
        <div className="w-10 h-10 rounded-xl bg-surface-glass border border-[rgba(76,215,246,0.2)] flex items-center justify-center animate-pulse">
          <Zap className="w-5 h-5 text-brand-cyan" />
        </div>
        <p className="text-on-surface-muted text-sm font-mono tracking-wider">
          LOADING...
        </p>
      </motion.div>
    </main>
  );
}

/* ──────────────────────────────────
   Login Screen
   ────────────────────────────────── */
function LoginScreen() {
  return (
    <main className="min-h-dvh flex items-center justify-center px-5 relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="w-full max-w-sm text-center"
      >
        {/* Animated icon */}
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="mx-auto mb-8 w-20 h-20 rounded-3xl glass-card-cyan flex items-center justify-center shadow-glow"
        >
          <Zap className="w-10 h-10 text-brand-cyan" strokeWidth={2.5} />
        </motion.div>

        {/* Brand name */}
        <h1 className="font-sora text-5xl sm:text-6xl font-bold text-brand-cyan glow-text mb-3 tracking-tight">
          Rant-X
        </h1>

        {/* Tagline */}
        <p className="text-on-surface-variant text-base sm:text-lg mb-10 px-4 leading-relaxed">
          Turn frustrations into powerful tweets
        </p>

        {/* Login card */}
        <div className="glass-card-heavy rounded-4xl p-8 sm:p-10">
          <button
            onClick={() => signIn("google")}
            id="google-signin-btn"
            className="
              btn-primary w-full rounded-full px-6 py-4
              flex items-center justify-center gap-3
              text-base font-semibold
            "
          >
            {/* Google icon */}
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Sign in with Google
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-[rgba(255,255,255,0.08)]" />
            <span className="font-mono text-xs text-on-surface-muted tracking-widest">
              SECURE
            </span>
            <div className="flex-1 h-px bg-[rgba(255,255,255,0.08)]" />
          </div>

          <p className="text-on-surface-muted text-xs leading-relaxed">
            Your complaints are processed securely. We never store your
            conversations.
          </p>
        </div>
      </motion.div>
    </main>
  );
}

/* ──────────────────────────────────
   Main Chat Screen
   ────────────────────────────────── */
export default function Home() {
  const { data: session, status } = useSession();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [tweet, setTweet] = useState("");
  const [tone, setTone] = useState("Direct");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function handleSend() {
    if (!input.trim() || loading) return;

    const updatedMessages = [
      ...messages,
      { role: "user", content: input },
    ];

    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updatedMessages, tone }),
      });

      const data = await response.json();

      if (data.question) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: data.question },
        ]);
      }

      setTweet(data.tweet);
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  }

  // Handle Enter key (Shift+Enter for newline)
  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  // Auth states
  if (status === "loading") return <LoadingScreen />;
  if (!session) return <LoginScreen />;

  // ── Authenticated View ──
  return (
    <main className="min-h-dvh relative z-10">
      {/* ── Header ── */}
      <header className="sticky top-0 z-30 glass-card-heavy border-b border-[rgba(255,255,255,0.06)] px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between h-14 sm:h-16">
          {/* Brand */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-brand-cyan/10 border border-brand-cyan/20 flex items-center justify-center">
              <Zap className="w-4 h-4 text-brand-cyan" />
            </div>
            <h1 className="font-sora text-lg sm:text-xl font-bold text-brand-cyan tracking-tight">
              Rant-X
            </h1>
          </div>

          {/* User info */}
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="hidden sm:block text-xs text-on-surface-muted font-mono truncate max-w-[180px]">
              {session.user?.email}
            </span>
            <button
              onClick={() => signOut()}
              id="logout-btn"
              className="
                w-9 h-9 sm:w-10 sm:h-10 rounded-xl btn-ghost
                flex items-center justify-center
              "
              aria-label="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* ── Tagline bar ── */}
      <div className="px-4 sm:px-6 py-3 border-b border-[rgba(255,255,255,0.04)]">
        <div className="max-w-7xl mx-auto">
          <p className="text-on-surface-muted text-xs sm:text-sm font-inter">
            Turn frustrating experiences into proper tweets ⚡
          </p>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6 lg:gap-8">
          {/* ── Left: Chat Area ── */}
          <div className="flex flex-col">
            {/* Chat messages container */}
            <div className="glass-card rounded-3xl sm:rounded-4xl p-4 sm:p-6 min-h-[350px] sm:min-h-[500px] lg:min-h-[600px] flex flex-col">
              <div className="flex-1 space-y-4 overflow-y-auto pr-1">
                {messages.length === 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center h-full text-center py-12"
                  >
                    <div className="w-16 h-16 rounded-2xl bg-surface-container border border-[rgba(76,215,246,0.1)] flex items-center justify-center mb-5">
                      <svg
                        className="w-8 h-8 text-brand-cyan opacity-40"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1.5}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z"
                        />
                      </svg>
                    </div>
                    <p className="text-on-surface-variant text-base font-sora font-medium mb-2">
                      Describe your complaint
                    </p>
                    <p className="text-on-surface-muted text-sm max-w-[260px]">
                      Tell us what happened and we'll craft the perfect
                      tweet for you
                    </p>
                  </motion.div>
                )}

                {messages.map((message, index) => (
                  <ChatBubble
                    key={index}
                    role={message.role}
                    content={message.content}
                  />
                ))}

                {/* Loading indicator */}
                <AnimatePresence>
                  {loading && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="flex items-center gap-3 px-4 py-3"
                    >
                      <div className="flex gap-1">
                        <span className="w-2 h-2 rounded-full bg-brand-cyan animate-bounce [animation-delay:0ms]" />
                        <span className="w-2 h-2 rounded-full bg-brand-cyan animate-bounce [animation-delay:150ms]" />
                        <span className="w-2 h-2 rounded-full bg-brand-cyan animate-bounce [animation-delay:300ms]" />
                      </div>
                      <span className="label-caps text-xs">
                        AI is analyzing...
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div ref={chatEndRef} />
              </div>
            </div>

            {/* ── Input Area ── */}
            <div className="mt-4 flex gap-2.5 sm:gap-3">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Describe your issue..."
                id="complaint-input"
                rows={2}
                className="
                  flex-1 input-dark rounded-2xl px-4 py-3 sm:px-5 sm:py-4
                  text-sm sm:text-base resize-none
                  font-inter placeholder:text-on-surface-muted
                  min-h-[56px] sm:min-h-[72px]
                "
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || loading}
                id="send-btn"
                className={`
                  w-14 sm:w-16 rounded-2xl flex items-center justify-center
                  transition-all duration-200
                  ${
                    input.trim() && !loading
                      ? "btn-cyan shadow-glow-sm"
                      : "bg-surface-container-high text-on-surface-muted cursor-not-allowed"
                  }
                `}
                aria-label="Send message"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* ── Right: Tweet Panel ── */}
          <TweetPanel tweet={tweet} tone={tone} setTone={setTone} />
        </div>
      </div>
    </main>
  );
}

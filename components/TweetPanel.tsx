"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  tweet: string;
  tone: string;
  setTone: (tone: string) => void;
}

const tones = ["Direct", "Witty", "Polite", "Professional"];

export default function TweetPanel({ tweet, tone, setTone }: Props) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    if (!tweet) return;
    navigator.clipboard.writeText(tweet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1, duration: 0.4 }}
      className="glass-card-cyan rounded-3xl sm:rounded-4xl p-5 sm:p-6 lg:sticky lg:top-6"
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-5">
        <div className="w-2 h-2 rounded-full bg-brand-cyan animate-pulse" />
        <h2 className="label-caps text-sm tracking-[0.12em]">
          FINAL RESULT
        </h2>
      </div>

      {/* Tone selector */}
      <div className="flex gap-2 mb-5 flex-wrap">
        {tones.map((t) => (
          <button
            key={t}
            onClick={() => setTone(t)}
            className={`
              px-3.5 py-2 rounded-full text-sm font-medium transition-all duration-200
              ${
                tone === t
                  ? "btn-cyan shadow-glow-sm"
                  : "btn-ghost"
              }
            `}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Tweet display */}
      <div className="glass-card rounded-2xl p-4 sm:p-5 min-h-[200px] sm:min-h-[280px]">
        <AnimatePresence mode="wait">
          {tweet ? (
            <motion.p
              key={tweet}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="font-sora text-lg sm:text-xl lg:text-2xl font-semibold leading-relaxed whitespace-pre-wrap text-on-surface"
            >
              {tweet}
            </motion.p>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center h-[200px] sm:h-[280px] text-center"
            >
              <div className="w-12 h-12 rounded-2xl bg-surface-container flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-brand-cyan opacity-50"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"
                  />
                </svg>
              </div>
              <p className="text-on-surface-muted text-sm font-inter">
                Generated tweet appears here...
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Copy button */}
      <button
        onClick={handleCopy}
        disabled={!tweet}
        className={`
          mt-5 w-full py-3.5 sm:py-4 rounded-2xl flex items-center justify-center gap-2.5
          font-sora font-bold text-sm sm:text-base tracking-wide transition-all duration-200
          ${
            tweet
              ? "btn-primary"
              : "bg-surface-container-high text-on-surface-muted cursor-not-allowed"
          }
        `}
      >
        {copied ? (
          <>
            <Check className="w-5 h-5" />
            COPIED!
          </>
        ) : (
          <>
            <Copy className="w-5 h-5" />
            COPY TWEET
          </>
        )}
      </button>
    </motion.div>
  );
}
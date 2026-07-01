"use client";

import { motion } from "framer-motion";

interface Props {
  role: string;
  content: string;
}

export default function ChatBubble({ role, content }: Props) {
  const isUser = role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={`
        relative px-4 py-3 sm:px-5 sm:py-4 rounded-2xl max-w-[88%] sm:max-w-[80%]
        ${
          isUser
            ? "ml-auto bg-surface-container-high border border-[rgba(255,255,255,0.06)]"
            : "mr-auto glass-card-cyan"
        }
      `}
    >
      {/* Role label */}
      <p className="label-caps mb-2">
        {isUser ? "YOU" : "AI ENGINE"}
      </p>

      {/* Message content */}
      <p className="font-inter text-[15px] sm:text-base leading-relaxed text-on-surface">
        {content}
      </p>

      {/* Subtle glow indicator for AI messages */}
      {!isUser && (
        <div
          className="absolute -left-px top-4 bottom-4 w-[2px] rounded-full bg-brand-cyan opacity-40"
          aria-hidden="true"
        />
      )}
    </motion.div>
  );
}
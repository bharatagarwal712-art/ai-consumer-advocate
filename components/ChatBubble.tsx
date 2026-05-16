"use client";

import { motion } from "framer-motion";

interface Props {
  role: string;
  content: string;
}

export default function ChatBubble({ role, content }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-5 rounded-2xl max-w-[85%] ${
        role === "user"
          ? "bg-zinc-800 ml-auto"
          : "bg-zinc-950 border border-cyan-500/40"
      }`}
    >
      <p className="text-xs tracking-[0.2em] text-cyan-400 mb-3 uppercase">
        {role === "user" ? "YOU" : "AI ENGINE"}
      </p>

      <p className="text-lg leading-relaxed">{content}</p>
    </motion.div>
  );
}
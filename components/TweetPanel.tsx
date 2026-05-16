"use client";

import { Copy } from "lucide-react";

interface Props {
  tweet: string;
  tone: string;
  setTone: (tone: string) => void;
}

const tones = ["Direct", "Witty", "Polite", "Professional"];

export default function TweetPanel({
  tweet,
  tone,
  setTone,
}: Props) {
  return (
    <div className="border border-cyan-500 rounded-2xl p-6 bg-zinc-950 sticky top-6">
      <h2 className="text-cyan-400 font-bold text-xl mb-6">
        FINAL RESULT
      </h2>

      <div className="flex gap-2 mb-6 flex-wrap">
        {tones.map((t) => (
          <button
            key={t}
            onClick={() => setTone(t)}
            className={`px-4 py-2 rounded-lg border ${
              tone === t
                ? "bg-cyan-500 text-black border-cyan-500"
                : "border-zinc-700"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="border border-zinc-700 rounded-2xl p-6 min-h-[320px] text-2xl font-semibold leading-relaxed whitespace-pre-wrap">
        {tweet || "Generated tweet appears here..."}
      </div>

      <button
        onClick={() => navigator.clipboard.writeText(tweet)}
        className="mt-6 w-full bg-white text-black py-4 rounded-xl flex items-center justify-center gap-2 font-bold"
      >
        <Copy className="w-5 h-5" />
        COPY
      </button>
    </div>
  );
}
"use client";

import { useEffect, useState } from "react";
import { Send } from "lucide-react";
import ChatBubble from "@/components/ChatBubble";
import TweetPanel from "@/components/TweetPanel";

import { signIn, signOut, useSession } from "next-auth/react";

interface Message {
  role: string;
  content: string;
}

export default function Home() {
  const { data: session, status } = useSession();

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [tweet, setTweet] = useState("");
  const [tone, setTone] = useState("Direct");
  const [loading, setLoading] = useState(false);

  async function handleSend() {
    if (!input.trim()) return;

    const updatedMessages = [
      ...messages,
      {
        role: "user",
        content: input,
      },
    ];

    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          messages: updatedMessages,
          tone,
        }),
      });

      const data = await response.json();

      if (data.question) {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: data.question,
          },
        ]);
      }

      setTweet(data.tweet);
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  }

  // Loading auth state
  if (status === "loading") {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        Loading...
      </main>
    );
  }

  // Not signed in
  if (!session) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
          <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-3">
              Rant-X
            </h1>
                <p className="text-zinc-400 text-lg">
              Login to access 
            </p>
          </div>
        <button
          onClick={() => signIn("google")}
          className="border border-cyan-500 px-6 py-3 rounded-2xl hover:bg-cyan-500 hover:text-black transition"
        >
          Sign in with Google
        </button>
      </main>
    );
  }

  // Signed in
  return (
    <main className="min-h-screen bg-black text-white px-6 py-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-3">
              Rant-X
            </h1>

            <p className="text-zinc-400 text-lg">
              Turn frustrating experiences into proper tweets. 
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-sm text-zinc-400">
              {session.user?.email}
            </div>

            <button
              onClick={() => signOut()}
              className="border border-zinc-700 px-4 py-2 rounded-xl hover:border-red-500"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <div className="border border-cyan-500/40 rounded-3xl p-6 bg-zinc-950 min-h-[600px] space-y-6">
              {messages.length === 0 && (
                <div className="text-zinc-500 text-lg">
                  Describe your complaint...
                </div>
              )}

              {messages.map((message, index) => (
                <ChatBubble
                  key={index}
                  role={message.role}
                  content={message.content}
                />
              ))}

              {loading && (
                <div className="text-cyan-400 animate-pulse">
                  AI is analyzing complaint...
                </div>
              )}
            </div>

            <div className="mt-6 flex gap-3">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Describe your issue..."
                className="flex-1 bg-zinc-950 border border-zinc-700 rounded-2xl px-5 py-4 outline-none focus:border-cyan-500 resize-none min-h-[100px]"
              />

              <button
                onClick={handleSend}
                className="bg-cyan-500 hover:bg-cyan-400 text-black px-6 rounded-2xl font-bold"
              >
                <Send className="w-6 h-6" />
              </button>
            </div>
          </div>

          <TweetPanel
            tweet={tweet}
            tone={tone}
            setTone={setTone}
          />
        </div>
      </div>
    </main>
  );
}

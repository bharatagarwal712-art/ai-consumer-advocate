import { NextRequest, NextResponse } from "next/server";
import { generateResponse } from "@/lib/bedrock";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { messages, tone } = body;

    const conversation = messages
      .map((m: any) => `${m.role}: ${m.content}`)
      .join("\\n");

    const prompt = `
You are an AI consumer complaint assistant.

Generate:
1. One follow-up question.
2. One complaint tweet.

Return ONLY valid JSON.

{
  "question": "...",
  "tweet": "..."
}

Tone: ${tone}

Conversation:
${conversation}
`;

    const raw = await generateResponse(prompt);

    console.log(raw);

    return NextResponse.json({
      question: "Can you share screenshots if available?",
      tweet: raw,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        question: "Can you provide more details?",
        tweet: "Unable to generate tweet.",
      },
      {
        status: 200,
      }
    );
  }
}

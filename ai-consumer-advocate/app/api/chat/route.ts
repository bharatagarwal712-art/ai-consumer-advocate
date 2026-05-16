import { NextRequest, NextResponse } from "next/server";
import { generateResponse, ChatMessage } from "@/lib/bedrock";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { messages, tone } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        {
          error: "messages array is required",
        },
        {
          status: 400,
        }
      );
    }

    // Build conversation string
    const conversation = messages
      .map((m: ChatMessage) => `${m.role}: ${m.content}`)
      .join("\n");

    // System prompt
    const systemPrompt = `
You are an AI consumer complaint assistant.

Your goals:
1. Understand the complaint.
2. Ask ONE concise follow-up question if useful.
3. Generate a strong public complaint tweet.

Rules:
- Avoid fabricated claims.
- Avoid legal accusations.
- Be concise.
- Optimize for clarity and engagement.
- Add relevant hashtags.
- Tone should be ${tone}.

Return ONLY valid JSON in this exact format:

{
  "question": "string",
  "tweet": "string"
}
`;

    // Final messages for model
    const finalMessages: ChatMessage[] = [
      {
        role: "system",
        content: systemPrompt,
      },
      {
        role: "user",
        content: conversation,
      },
    ];

    // Call Bedrock
    const rawResponse = await generateResponse(finalMessages);

    let parsed;

    try {
      parsed = JSON.parse(rawResponse);
    } catch {
      console.error("[route] Failed to parse model JSON:", rawResponse);

      return NextResponse.json({
        question: "Can you provide more details?",
        tweet: rawResponse,
      });
    }

    return NextResponse.json({
      question:
        parsed.question ||
        "Can you share screenshots or additional details?",
      tweet:
        parsed.tweet ||
        "Unable to generate tweet right now.",
    });
  } catch (error) {
    console.error("[route] Error:", error);

    return NextResponse.json(
      {
        error: "Internal server error",
      },
      {
        status: 500,
      }
    );
  }
}

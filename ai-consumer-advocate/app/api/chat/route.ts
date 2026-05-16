import { NextRequest, NextResponse } from "next/server";
import { generateResponse } from "@/lib/bedrock";

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

    // Convert conversation into plain text
    const conversation = messages
      .map((m: any) => `${m.role}: ${m.content}`)
      .join("\n");

    // System prompt
    const systemPrompt = `
You are an AI consumer complaint assistant.

Your goals:
1. Understand the complaint.
2. Ask ONE useful follow-up question if needed.
3. Generate a strong complaint tweet.

Rules:
- Avoid fabricated claims
- Avoid legal accusations
- Keep tweets concise
- Add relevant hashtags
- Tone should be ${tone}

Return ONLY valid JSON in this exact format:

{
  "question": "string",
  "tweet": "string"
}
`;

    // Final message payload for DeepSeek
    const finalMessages = [
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
   const rawResponse = await generateResponse(
  JSON.stringify(finalMessages)
);

    console.log("[route] RAW MODEL RESPONSE:", rawResponse);

    let parsed;

    try {
      parsed = JSON.parse(rawResponse);
    } catch (err) {
      console.error("[route] JSON parse failed:", err);

      return NextResponse.json({
        question: "Can you share screenshots or additional proof?",
        tweet: rawResponse,
      });
    }

    return NextResponse.json({
      question:
        parsed.question ||
        "Can you provide more details about the issue?",
      tweet:
        parsed.tweet ||
        "Unable to generate tweet right now.",
    });
  } catch (error) {
    console.error("[route] ERROR:", error);

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

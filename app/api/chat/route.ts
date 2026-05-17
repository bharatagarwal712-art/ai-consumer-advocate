import { NextRequest, NextResponse } from "next/server";
import { generateResponse } from "@/lib/bedrock";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { messages, tone } = body;

    const conversation = messages
      .map((m: any) => `${m.role}: ${m.content}`)
      .join("\n");

    const systemPrompt = `
You are an AI consumer complaint assistant.

Goals:
1. Understand complaint
2. Ask ONE useful follow-up question
3. Generate a strong complaint tweet

Rules:
- Avoid fabricated claims
- Avoid legal accusations
- Add hashtags
- Tone: ${tone}

Return ONLY valid JSON:

{
  "question": "string",
  "tweet": "string"
}
`;

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

    const raw = await generateResponse(finalMessages);

    console.log("[RAW MODEL OUTPUT]", raw);

    let parsed;

    try {
      parsed = JSON.parse(raw);
    } catch {
      return NextResponse.json({
        question: "Can you share more details?",
        tweet: raw,
      });
    }

    return NextResponse.json({
      question:
        parsed.question ||
        "Can you share screenshots or proof?",
      tweet:
        parsed.tweet ||
        "Unable to generate tweet.",
    });
  } catch (error) {
    console.error(error);

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

import { NextRequest, NextResponse } from "next/server";
import { generateResponse } from "@/lib/bedrock";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { messages, tone } = body;

    const conversation = messages
      .map((m: any) => `${m.role}: ${m.content}`)
      .join("\n");

    const prompt = `
You are an AI consumer complaint assistant.

Your goals:
1. Understand the complaint.
2. Ask ONE useful follow-up question if needed.
3. Generate a strong complaint tweet.

Return ONLY valid JSON:

{
  "question": "string",
  "tweet": "string"
}

Conversation:
${conversation}

Tone:
${tone}
`;

    const raw = await generateResponse(prompt);

    console.log(raw);

    const parsed = JSON.parse(raw);

    return NextResponse.json({
      question:
        parsed.question ||
        "Can you share any screenshots or proof?",
      tweet:
        parsed.tweet ||
        "Unable to generate tweet right now.",
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

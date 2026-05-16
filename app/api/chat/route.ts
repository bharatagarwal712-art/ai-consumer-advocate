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
2. Extract important context.
3. Determine the MOST useful missing information.
4. Ask ONE concise follow-up question if needed.
5. Generate a strong complaint tweet.

Rules:
- Avoid fabricated claims.
- Avoid legal accusations.
- Be concise.
- Optimize for clarity and engagement.
- Add relevant hashtags.
- Tone should be ${tone}.

Return ONLY valid JSON:

{
  "question": "string",
  "tweet": "string"
}

Conversation:
${conversation}
`;

    const result = await generateResponse(prompt);
    const parsed = JSON.parse(result);

    return NextResponse.json(parsed);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Failed to process request",
      },
      {
        status: 500,
      }
    );
  }
}
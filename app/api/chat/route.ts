import { findTwitterHandle } from "@/lib/search";
import { NextRequest, NextResponse } from "next/server";
import { generateResponse } from "@/lib/bedrock";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { messages, tone } = body;

    const conversation = messages
      .map((m: any) => `${m.role}: ${m.content}`)
      .join("\n");
const companyPrompt = `
Extract ONLY the company name from this complaint.

Complaint:
${conversation}

Return ONLY the company name.
`;

const companyRaw = await generateResponse([
  {
    role: "user",
    content: companyPrompt,
  },
]);

const company = companyRaw.trim();

console.log("[COMPANY]", company);

    const officialHandle =
  await findTwitterHandle(company);

    console.log("[OFFICIAL HANDLE]", officialHandle);

console.log("[HANDLE]", officialHandle);

    console.log("[COMPANY RAW]", companyRaw);
console.log("[COMPANY CLEAN]", company);
    
    const systemPrompt = `
You are an AI consumer complaint assistant.

Your task is to determine whether enough information exists to create an effective public complaint tweet.

Mandatory information:
- company name
- issue type
- what happened

Helpful optional information:
- screenshots
- order ID
- timestamps
- customer support interaction
- location
- proof

Rules:
- Avoid fabricated claims
- Avoid legal accusations
- Keep tweets concise
- Add relevant hashtags
- Tone should be ${tone}

Decision logic:

IF important information is missing:
- set needs_more_info to true
- ask ONE concise follow-up question
- do NOT generate tweet yet

IF enough information exists:
- set needs_more_info to false
- generate a strong complaint tweet

Official X handle (if verified):
${officialHandle || "Not found"}

If official handle is unavailable:
- intelligently infer likely handle
- avoid random hallucinated handles

Return ONLY valid JSON in this exact format:

{
  "needs_more_info": boolean,
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
  debug: {
    company,
    officialHandle,
  },

  needs_more_info: parsed.needs_more_info ?? false,
  question: parsed.question || "",
  tweet: parsed.tweet || "",
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

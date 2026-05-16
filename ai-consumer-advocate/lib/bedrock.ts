import {
  BedrockRuntimeClient,
  InvokeModelCommand,
} from "@aws-sdk/client-bedrock-runtime";

// ── Env validation ────────────────────────────────────────────────────────────
const AWS_REGION = process.env.AWS_REGION;
const BEDROCK_MODEL_ID = process.env.BEDROCK_MODEL_ID;

if (!AWS_REGION || !BEDROCK_MODEL_ID) {
  throw new Error(
    "Missing required environment variables: AWS_REGION and BEDROCK_MODEL_ID must be set."
  );
}

// ── Client ────────────────────────────────────────────────────────────────────
const client = new BedrockRuntimeClient({ region: AWS_REGION });

// ── Types ─────────────────────────────────────────────────────────────────────
export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

interface DeepSeekResponse {
  choices: {
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }[];
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

// ── Core function ─────────────────────────────────────────────────────────────

/**
 * Send a conversation history to DeepSeek on AWS Bedrock.
 * @param messages - Full chat history including system messages if any.
 * @returns The assistant's reply as a plain string.
 */
export async function generateResponse(messages: ChatMessage[]): Promise<string> {
  if (!messages || messages.length === 0) {
    throw new Error("messages array must be non-empty.");
  }

  const body = {
    messages,
    max_tokens: 1000,
    temperature: 0.7,
  };

  if (process.env.NODE_ENV !== "production") {
    console.log("[bedrock] REQUEST:", JSON.stringify(body, null, 2));
  }

  const command = new InvokeModelCommand({
    modelId: BEDROCK_MODEL_ID,
    contentType: "application/json",
    accept: "application/json",
    body: JSON.stringify(body),
  });

  let decoded: string;

  try {
    const response = await client.send(command);
    decoded = new TextDecoder().decode(response.body);
  } catch (err) {
    console.error("[bedrock] Invocation failed:", err);
    throw new Error("Bedrock request failed. Check your credentials, region, and model ID.");
  }

  if (process.env.NODE_ENV !== "production") {
    console.log("[bedrock] RAW RESPONSE:", decoded);
  }

  let parsed: DeepSeekResponse;

  try {
    parsed = JSON.parse(decoded);
  } catch {
    console.error("[bedrock] Failed to parse response JSON:", decoded);
    throw new Error("Invalid JSON returned from Bedrock.");
  }

  const text = parsed?.choices?.[0]?.message?.content;

  if (!text) {
    console.error("[bedrock] Unexpected response shape:", parsed);
    throw new Error("No content found in Bedrock response.");
  }

  return text;
}

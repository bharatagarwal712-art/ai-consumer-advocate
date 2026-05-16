import {
  BedrockRuntimeClient,
  InvokeModelCommand,
} from "@aws-sdk/client-bedrock-runtime";

const client = new BedrockRuntimeClient({
  region: process.env.AWS_REGION!,
});

export async function generateResponse(prompt: string) {
  const modelId = process.env.BEDROCK_MODEL_ID!;

  const isClaude = modelId.includes("anthropic");

  let body: any;

  // Claude format
  if (isClaude) {
    body = {
      anthropic_version: "bedrock-2023-05-31",
      max_tokens: 1000,
      temperature: 0.7,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: prompt,
            },
          ],
        },
      ],
    };
  }

  // DeepSeek / OpenAI-style format
  else {
    body = {
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      max_tokens: 1000,
      temperature: 0.7,
    };
  }

  const command = new InvokeModelCommand({
    modelId,
    contentType: "application/json",
    accept: "application/json",
    body: JSON.stringify(body),
  });

  const response = await client.send(command);

  const decoded = new TextDecoder().decode(response.body);

  console.log(decoded);

  const parsed = JSON.parse(decoded);

  // Claude response parsing
  if (isClaude) {
    return parsed.content?.[0]?.text || "";
  }

  // DeepSeek parsing
  return (
    parsed.choices?.[0]?.message?.content ||
    parsed.output ||
    JSON.stringify(parsed)
  );
}

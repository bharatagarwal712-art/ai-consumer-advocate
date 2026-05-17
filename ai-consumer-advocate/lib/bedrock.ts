import {
  BedrockRuntimeClient,
  ConverseCommand,
} from "@aws-sdk/client-bedrock-runtime";

const client = new BedrockRuntimeClient({
  region: process.env.AWS_REGION!,
});

export async function generateResponse(messages: any[]) {
  const command = new ConverseCommand({
    modelId: process.env.BEDROCK_MODEL_ID!,

    messages: messages.map((m) => ({
      role: m.role === "system" ? "user" : m.role,
      content: [
        {
          text: m.content,
        },
      ],
    })),

    inferenceConfig: {
      maxTokens: 1000,
      temperature: 0.7,
    },
  });

  const response = await client.send(command);

  console.log("[BEDROCK RESPONSE]", JSON.stringify(response, null, 2));

  const text =
    response.output?.message?.content?.[0]?.text;

  if (!text) {
    throw new Error("No response text found.");
  }

  return text;
}

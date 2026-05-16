import {
  BedrockRuntimeClient,
  InvokeModelCommand,
} from "@aws-sdk/client-bedrock-runtime";

const client = new BedrockRuntimeClient({
  region: process.env.AWS_REGION!,
});

export async function generateResponse(prompt: string) {
  const command = new InvokeModelCommand({
    modelId: process.env.BEDROCK_MODEL_ID!,
    contentType: "application/json",
    accept: "application/json",

    body: JSON.stringify({
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      max_tokens: 1000,
      temperature: 0.7,
    }),
  });

  const response = await client.send(command);

  const decoded = new TextDecoder().decode(response.body);

  console.log(decoded);

  const parsed = JSON.parse(decoded);

  return (
    parsed.choices?.[0]?.message?.content ||
    parsed.output ||
    parsed.generation ||
    JSON.stringify(parsed)
  );
}

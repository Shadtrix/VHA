// backend/utils/claude.js
import {
  BedrockRuntimeClient,
  InvokeModelCommand,
} from "@aws-sdk/client-bedrock-runtime";

const client = new BedrockRuntimeClient({ region: "ap-southeast-1" });

export async function callClaude(prompt) {
  const input = {
    modelId: "anthropic.claude-3-sonnet-20240229-v1:0",
    contentType: "application/json",
    accept: "application/json",
    body: JSON.stringify({
      messages: [{ role: "user", content: prompt }],
      max_tokens: 1024,
    }),
  };

  const command = new InvokeModelCommand(input);
  const response = await client.send(command);
  const json = JSON.parse(Buffer.from(response.body).toString("utf8"));
  return json.content[0].text;
}

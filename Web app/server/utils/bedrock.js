const {
  BedrockRuntimeClient,
  InvokeModelWithResponseStreamCommand
} = require("@aws-sdk/client-bedrock-runtime");
const { TextDecoder } = require("util");
require("dotenv").config();

const bedrock = new BedrockRuntimeClient({
  region: process.env.AWS_REGION,
});

async function callClaude(prompt) {
  const command = new InvokeModelWithResponseStreamCommand({
    modelId: process.env.BEDROCK_PROFILE_ARN, // ✅ should be modelId
    contentType: "application/json",
    accept: "application/json",
    body: JSON.stringify({
      anthropic_version: "bedrock-2023-05-31",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 300
    })
  });

  try {
    const response = await bedrock.send(command);
    let result = "";

    for await (const chunk of response.body) {
      if (chunk.chunk?.bytes) {
        const json = JSON.parse(new TextDecoder().decode(chunk.chunk.bytes));
        result += json.delta?.text || "";
      }
    }

    return result.trim();
  } catch (err) {
    console.error("❌ AWS Bedrock error:", err);
    throw err;
  }
}

module.exports = { callClaude };

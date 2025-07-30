const {
  BedrockRuntimeClient,
  InvokeModelWithResponseStreamCommand
} = require("@aws-sdk/client-bedrock-runtime");
require("dotenv").config();
const { TextDecoder } = require("util");

const client = new BedrockRuntimeClient({
  region: process.env.AWS_REGION,
});

const MODEL_ID = process.env.BEDROCK_PROFILE_ARN; // This must be an ARN of an inference profile

const callClaude = async (email) => {
  const prompt = `Assign a role for this email: ${email}. If it ends with @vha.com, the role should be "admin". Otherwise, "user". Only reply with "admin" or "user".`;

  const command = new InvokeModelWithResponseStreamCommand({
    modelId: MODEL_ID,
    contentType: "application/json",
    accept: "application/json",
    body: JSON.stringify({
      anthropic_version: "bedrock-2023-05-31",
      messages: [
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 50,
      temperature: 0
    })
  });

  try {
    const response = await client.send(command);
    let result = "";

    for await (const chunk of response.body) {
      if (chunk.chunk?.bytes) {
        const json = JSON.parse(new TextDecoder().decode(chunk.chunk.bytes));
        result += json.delta?.text || "";
      }
    }

    return result.trim();
  } catch (err) {
    console.error("❌ Claude error:", err);
    throw err;
  }
};

module.exports = { callClaude };

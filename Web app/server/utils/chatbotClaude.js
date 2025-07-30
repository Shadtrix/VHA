const { BedrockRuntimeClient, InvokeModelCommand } = require("@aws-sdk/client-bedrock-runtime");

const client = new BedrockRuntimeClient({ region: "ap-southeast-1" });

const callClaudeChatbot = async (prompt) => {
  const command = new InvokeModelCommand({
    modelId: "arn:aws:bedrock:ap-southeast-1:588922096295:inference-profile/apac.anthropic.claude-3-sonnet-20240229-v1:0",
    contentType: "application/json",
    accept: "application/json",
    body: JSON.stringify({
      anthropic_version: "bedrock-2023-05-31",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 1024,
      temperature: 0.7
    }),
  });

  const response = await client.send(command);
  const result = JSON.parse(new TextDecoder().decode(response.body));
  return result.content[0].text.trim();
};

module.exports = { callClaudeChatbot };
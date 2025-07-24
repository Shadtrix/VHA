const { BedrockRuntimeClient, InvokeModelCommand } = require("@aws-sdk/client-bedrock-runtime");

const client = new BedrockRuntimeClient({ region: "ap-southeast-1" }); // Change region if needed

async function moderateReviewWithBedrock(rating, description) {
  const messages = [
    {
      role: "user",
      content: `A user left a review with a rating of ${rating} stars and the following comment:
"${description}"

Does the sentiment of the comment match the rating? If not, explain why. If the rating is high but the comment is negative, or vice versa, reply with:
{
  "featured": false,
  "reason": "Your explanation here"
}
Otherwise, reply with:
{
  "featured": true,
  "reason": ""
}
Respond only with valid JSON.`
    }
  ];

  const input = {
    modelId: "arn:aws:bedrock:ap-southeast-1:588922096295:inference-profile/apac.anthropic.claude-3-sonnet-20240229-v1:0", // Or your profile ARN
    contentType: "application/json",
    accept: "application/json",
    body: JSON.stringify({
      anthropic_version: "bedrock-2023-05-31", // Specify the version if needed
      messages,
      max_tokens: 200,
      temperature: 0,
      top_p: 1
    }),
  };

  const command = new InvokeModelCommand(input);
  const response = await client.send(command);

  // Parse the model's JSON response
  const responseBody = JSON.parse(new TextDecoder().decode(response.body));
  // Claude 3 returns the text in a 'content' property inside the first message
  const aiResult = JSON.parse(responseBody.content[0].text);

  return aiResult;
}

module.exports = moderateReviewWithBedrock;
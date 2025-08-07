require("dotenv").config();
const mysql = require("mysql2/promise");
const { BedrockRuntimeClient, InvokeModelCommand } = require("@aws-sdk/client-bedrock-runtime");

const client = new BedrockRuntimeClient({ region: "ap-southeast-1" });
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


async function classifyEmailWithBedrock(subject, body, categories) {
  const categoryList = categories.map(
    (c) => `${c.id}: ${c.name}`
  ).join("\n");

  const messages = [
    {
      role: "user",
      content: `You are an AI assistant that classifies emails into one or more relevant categories based on their subject and body content. Go beyond exact keyword matches—use your understanding of language and context to identify the intent, topic, or underlying themes in each email.

Assign categories that best reflect what the email is about, even if the email doesn’t explicitly use the category names. If the email content is relevant to multiple categories, assign all that apply.

Think semantically: infer relationships between words and concepts. For example, an email about “resolving login problems” might relate to “Technical Support,” while one about “refund for wrong billing” might be classified under both “Billing” and “Customer Complaints.”

Prioritize relevance and content similarity, not just surface matches. The goal is to help users easily find and organize their emails based on meaningful, human-like categorization.

Here are the available categories (ID: Name):
${categoryList}

Classify the email below and return ALL matching category IDs in this format:
{ "category_ids": [30, 31] }

Email:
Subject: ${subject}
Body: ${body}

Respond only with valid JSON.`
    }
  ];

  const input = {
    modelId: "arn:aws:bedrock:ap-southeast-1:588922096295:inference-profile/apac.anthropic.claude-3-sonnet-20240229-v1:0",
    contentType: "application/json",
    accept: "application/json",
    body: JSON.stringify({
      anthropic_version: "bedrock-2023-05-31",
      messages,
      max_tokens: 200,
      temperature: 0,
      top_p: 1,
    }),
  };

  const command = new InvokeModelCommand(input);
  const response = await client.send(command);

  const responseBody = JSON.parse(new TextDecoder().decode(response.body));
  const aiResponse = JSON.parse(responseBody.content[0].text);

  return aiResponse.category_ids || [];
}

async function reclassifyAllEmails() {
  const db = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PWD,
    database: process.env.DB_NAME,
  });

  const [categories] = await db.query("SELECT id, name FROM categories");
  const validCategoryIds = categories.map((c) => c.id);

  if (!categories.length) {
    console.error("❌ No categories found.");
    return;
  }

  await db.query(
    `UPDATE emails SET category_id = NULL 
     WHERE category_id IS NOT NULL AND category_id NOT IN (${validCategoryIds.join(",")})`
  );

  const [emails] = await db.query("SELECT * FROM emails");

  for (const email of emails) {
    while (true) {
      try {
        await sleep(2000);

        const categoryIds = await classifyEmailWithBedrock(email.subject, email.body, categories);
        const filteredCategoryIds = categoryIds.filter((id) => validCategoryIds.includes(id));

        if (filteredCategoryIds.length > 0) {
          const primaryCategoryId = filteredCategoryIds[0];

          await db.query(
            "UPDATE emails SET category_id = ?, last_classified_at = NOW() WHERE id = ?",
            [primaryCategoryId, email.id]
          );

          await db.query("DELETE FROM email_categories WHERE email_id = ?", [email.id]);

          for (const cid of filteredCategoryIds) {
            try {
              await db.query("INSERT INTO email_categories (email_id, category_id) VALUES (?, ?)", [email.id, cid]);
            } catch (insertErr) {
              console.error(`❌ Failed to insert (${email.id}, ${cid}) into email_categories:`, insertErr);
            }
          }

          console.log(`✅ Email ${email.id} classified as: [${filteredCategoryIds.join(", ")}]`);
        } else {
          console.warn(`⚠️ Email ${email.id} returned no valid category IDs.`);
        }

        break;

      } catch (err) {
        console.error(`❌ Error classifying email ${email.id}, retrying in 5s...`, err.message);
        await sleep(5000);
      }
    }
  }

  console.log("🎉 Reclassification complete.");
}
module.exports = { classifyEmailWithBedrock, reclassifyAllEmails };
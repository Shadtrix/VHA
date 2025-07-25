require("dotenv").config();
const mysql = require("mysql2/promise");
const { BedrockRuntimeClient, InvokeModelCommand } = require("@aws-sdk/client-bedrock-runtime");

const client = new BedrockRuntimeClient({ region: "ap-southeast-1" });

async function classifyEmailWithBedrock(subject, body, categories) {
  const categoryList = categories.map(
    (c) => `${c.id}: ${c.name}`
  ).join("\n");

  const messages = [
    {
      role: "user",
      content: `You are an AI assistant that classifies emails into one or more categories based on the subject and body.

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
    try {
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
          await db.query("INSERT INTO email_categories (email_id, category_id) VALUES (?, ?)", [email.id, cid]);
        }

        console.log(`✅ Email ${email.id} classified as: [${filteredCategoryIds.join(", ")}], primary: ${primaryCategoryId}`);
      } else {
        console.warn(`⚠️ Email ${email.id} returned no valid category IDs.`);
      }
    } catch (err) {
      console.error(`❌ Error classifying email ${email.id}:`, err.message);
    }
  }

  await db.end();
  console.log("🎉 Reclassification complete.");
}

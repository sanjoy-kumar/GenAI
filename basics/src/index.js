import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
});

async function run() {
  try {
    const response = await openai.chat.completions.create({
      model: "openai/gpt-3.5-turbo", // gpt-4o
      messages: [{ role: "user", content: "How are you?" }],
    });
    console.log(response.choices[0].message.content);
  } catch (error) {
    if (error.status === 429) {
      console.error("❌ Rate limit or quota exceeded. Check your OpenAI plan and billing.");
    } else {
      console.error("❌ Error:", error);
    }
  }
}

run();

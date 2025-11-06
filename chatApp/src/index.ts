import OpenAI from "openai";
import dotenv from "dotenv";
// @ts-ignore
import promptSync from "prompt-sync";

dotenv.config();

const prompt = promptSync({ sigint: true });

const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
});


type Context = { role: "system" | "user" | "assistant", content: string }[]

const context: Context = [
  {
    role: "system",
    content: "You are a helpful assistant.",
  },
  {
    role: "user",
    content: "Hello, how are you?",
  },
];

async function chatCompletion() {
  const response = await openai.chat.completions.create({
    model: "openai/gpt-3.5-turbo", // or "openai/gpt-4o"
    messages: context,
  });

  const responseMessage = response?.choices[0]?.message;

  if (responseMessage?.content) {
    context.push({
      role: "assistant",
      content: responseMessage.content,
    });

    console.log(`Assistant (${responseMessage.role}): ${responseMessage.content}`);
  }
}

async function run() {
  try {
    while (true) {
      const userInput = prompt("You: ");

      if (!userInput) continue;
      if (userInput.toLowerCase() === "exit") {
        console.log("Exiting chat...");
        break;
      }

      context.push({
        role: "user",
        content: userInput,
      });

      await chatCompletion();
    }
  } catch (error) {
    console.error("❌ Error:", error);
  }
}

run();

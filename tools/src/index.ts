import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
});

// Custom function to get current time in New York
function getTimeInNewYork() {
  return new Date().toLocaleString("en-US", {
    timeZone: "America/New_York",
  });
}

async function callOpenAITool() {
  const context: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
    {
      role: "system",
      content: "You are a helpful assistant.",
    },
    {
      role: "user",
      content: "What is the current time in New Delhi, India?",
    },
  ];

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: context,
    tools: [
      {
        type: "function",
        function: {
          name: "getTimeInNewYork",
          description: "Get the current time in New York.",
          parameters: {}, // required even if empty
        },
      },
    ],
    tool_choice: "auto",
  });

  // --- Safely access response data ---
  const message = response.choices[0]?.message;
  const toolCall = message?.tool_calls?.[0];

  // --- Type guard for toolCall ---
  if (
    toolCall &&
    toolCall.type === "function" &&
    toolCall.function?.name === "getTimeInNewYork"
  ) {
    const time = getTimeInNewYork();

    // Push only if message exists
    if (message) {
      context.push(
        message as OpenAI.Chat.Completions.ChatCompletionMessageParam
      );
    }

    context.push({
      role: "tool",
      tool_call_id: toolCall.id,
      content: time,
    });

    // --- Second call to model with tool result ---
    const secondResponse = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: context,
    });

    console.log("🕓 Assistant:", secondResponse.choices[0]?.message.content);
  } else {
    console.log("🤖 Assistant:", message?.content);
  }
}

callOpenAITool();

// listModels.js
import fetch from "node-fetch";
import dotenv from "dotenv";
dotenv.config();

async function listModels() {
  const res = await fetch("https://openrouter.ai/api/v1/models", {
    headers: { Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}` },
  });

  if (!res.ok) {
    const err = await res.text();
    console.error("Error fetching models:", res.status, err);
    return;
  }

  const json = await res.json();
  // json.models or json.data depending on response; print entire body if unsure
  console.log("Full models response (truncated):", JSON.stringify(json, null, 2).slice(0, 4000));
  // try to find likely TTS entries
  const bodyStr = JSON.stringify(json).toLowerCase();
  if (bodyStr.includes("tts") || bodyStr.includes("audio") || bodyStr.includes("eleven") || bodyStr.includes("voice")) {
    console.log("\n--- Candidate lines with 'tts' / 'audio' / 'voice' / 'eleven' ---\n");
    const matches = JSON.stringify(json, null, 2)
      .split("\n")
      .filter(line => /tts|audio|voice|eleven|speech|text-to-speech|text to speech/i.test(line));
    matches.forEach(l => console.log(l));
  } else {
    console.log("No obvious TTS entries found in the model list. Inspect the full response above.");
  }
}

listModels().catch(e => console.error(e));

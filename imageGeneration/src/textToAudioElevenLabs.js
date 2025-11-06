import fetch from "node-fetch";
import dotenv from "dotenv";
import { writeFileSync } from 'fs';

dotenv.config();


// Option 1: ElevenLabs (best realistic voices)

const API_KEY = process.env.ELEVENLABS_API_KEY;

async function textToSpeech(text) {
  const voiceId = "pNInz6obpgDQGcFmaJgB"; // changeable voice
  const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
    method: "POST",
    headers: {
      "xi-api-key": API_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text,
      model_id: "eleven_multilingual_v2",
      voice_settings: {
        stability: 0.5,
        similarity_boost: 0.8,
      },
    }),
  });

  if (!response.ok) {
    console.error("❌ ElevenLabs API Error:", await response.text());
    return;
  }

  const buffer = Buffer.from(await response.arrayBuffer());
  writeFileSync("output.mp3", buffer); // Remove the 'fs.' prefix
  console.log("✅ Audio generated: output.mp3");
}

textToSpeech("Hello Sanjoy! This is a working ElevenLabs text-to-speech example.");


import fs from "fs/promises";
import fetch from "node-fetch";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Encode audio to base64
async function encodeAudioToBase64(audioPath) {
  const audioBuffer = await fs.readFile(audioPath);
  return audioBuffer.toString("base64");
}

// Transcribe audio using OpenRouter API
async function transcribeAudio() {
  try {
    const audioPath = "./harvard.wav"; // path where mic recorded file is saved
    const base64Audio = await encodeAudioToBase64(audioPath);

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: "Please transcribe this audio file." },
              { type: "input_audio", input_audio: { data: base64Audio, format: "wav" } },
            ],
          },
        ],
      }),
    });

    const data = await response.json();
    console.log("Full API Response:", JSON.stringify(data, null, 2)); // optional for debugging

    // ✅ Correctly access transcription text
    if (data?.choices?.length > 0) {
      console.log("📝 Transcribed Text:", data.choices[0].message.content);
    } else {
      console.error("❌ No transcription text found in response:", data);
    }

  } catch (error) {
    console.error("❌ Error during transcription:", error);
  }
}

// Run transcription
transcribeAudio();

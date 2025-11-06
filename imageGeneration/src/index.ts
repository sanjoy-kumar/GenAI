import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

interface ImageChoice {
  b64_json?: string;
  image_url?: { url: string };
}

interface ApiResponse {
  choices?: { images?: ImageChoice[]; text?: string }[];
}

async function generateImage(prompt: string, filename: string) {
  const response = await fetch("https://openrouter.ai/api/v1/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "google/gemini-2.5-flash-image-preview",
      prompt,
      size: "1024x1024",
    }),
  });

  if (!response.ok) {
    console.error("❌ Error:", response.status, await response.text());
    return;
  }

  const result = (await response.json()) as ApiResponse;

  const imageData = result?.choices?.[0]?.images?.[0];

  let imageBuffer: Buffer | null = null;

  if (imageData?.b64_json) {
    imageBuffer = Buffer.from(imageData.b64_json, "base64");
  } else if (
    imageData?.image_url?.url &&
    imageData.image_url.url.startsWith("data:image/")
  ) {
    const parts = imageData.image_url.url.split(",");
    if (parts[1]) {
      imageBuffer = Buffer.from(parts[1], "base64");
    }
  }

  if (!imageBuffer) {
    console.error("❌ No base64 image found:", imageData);
    return;
  }

  fs.writeFileSync(filename, imageBuffer);
  console.log("✅ Image saved locally as:", filename);
}

// Example usage
generateImage(
  "A beuatiful landscape with mountains and a lake",
  "mountain-lake.png"
);

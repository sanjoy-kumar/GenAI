import fs from "fs";
import util from "util";
import textToSpeech from "@google-cloud/text-to-speech";
import dotenv from "dotenv";

dotenv.config(); // load GOOGLE_APPLICATION_CREDENTIALS from .env

const client = new textToSpeech.TextToSpeechClient();

async function textToAudio(text) {
  const request = {
    input: { text },
    voice: { languageCode: "en-US", ssmlGender: "FEMALE" },
    audioConfig: { audioEncoding: "MP3" },
  };

  const [response] = await client.synthesizeSpeech(request);
  const writeFile = util.promisify(fs.writeFile);
  await writeFile("output-google-tts.mp3", response.audioContent, "binary");
  console.log("✅ Audio file created: output-google-tts.mp3");
}

textToAudio("Hello Sanjoy! Google Cloud text-to-speech is now working.");

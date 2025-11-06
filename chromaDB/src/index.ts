import { ChromaClient } from "chromadb";
import { OpenAI } from "openai";
import dotenv from "dotenv";
//@ts-ignore
import { HuggingFaceEmbedding } from "./hfEmbedding.ts";
//@ts-ignore
import { VoyageEmbedding } from "./voyageEmbedding.js";

dotenv.config();

const chromaClient = new ChromaClient({ host: "localhost", port: 8000 });

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

class OpenAIEmbedding {
  async generate(texts: string[]): Promise<number[][]> {
    const response = await openai.embeddings.create({
      model: "text-embedding-3-small", // dimension = 1536
      input: texts,
    });
    return response.data.map((item: any) => item.embedding);
  }
}

// 🔧 Create or get existing collection (don’t delete each time)
const getOrCreateCollection = async () => {
  const embedder = new OpenAIEmbedding(); // other embedding models => HuggingFaceEmbedding(); & VoyageEmbedding();
  const existing = await chromaClient.listCollections();
  const found = existing.find((col: any) => col.name === "my_collection");

  if (found) {
    // ✅ embedder passed here
    return await chromaClient.getCollection({
      name: "my_collection",
      embeddingFunction: embedder,
    });
  } else {
    return await chromaClient.createCollection({
      name: "my_collection",
      embeddingFunction: embedder,
    });
  }
};


// 🧩 Add one message
const addMessage = async (id: string, text: string) => {
  const collection = await getOrCreateCollection();
  await collection.add({ ids: [id], documents: [text] });
  console.log(`✅ Added: ${text}`);
};

// 🔍 Query similar messages
const getSimilarMessages = async (text: string, limit = 5) => {
  const collection = await getOrCreateCollection();
  const results = await collection.query({
    queryTexts: [text],
    nResults: limit,
  });
  console.log("🔍 Similar:", results.documents?.[0] || []);
  return results.documents?.[0] || [];
};

// 🚀 Run
const run = async () => {
  // only delete once at start if you want a clean run
  //await chromaClient.deleteCollection({ name: "my_collection" }).catch(() => {});
  
  // Create fresh collection once
  await getOrCreateCollection();

  await addMessage("1", "Hello, how can I help you today?");
  await addMessage("2", "Sure, I can book your appointment.");
  await addMessage("3", "The weather is sunny and warm.");

  await getSimilarMessages("Can you help me with booking?");
};

run();

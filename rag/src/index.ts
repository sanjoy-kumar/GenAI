import dotenv from "dotenv";
dotenv.config();

import fs from "fs/promises";
import { Document } from "@langchain/core/documents";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { OpenAIEmbeddings, ChatOpenAI } from "@langchain/openai";
// ✅ use this import (works across versions)
import { MemoryVectorStore } from "langchain/vectorstores/memory";

async function main() {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("Set OPENAI_API_KEY in .env");
  }

  const rawData = await fs.readFile("./src/data/data.txt", "utf-8");

  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 100,
    chunkOverlap: 20,
  });

  const docs = await splitter.splitDocuments([
    new Document({ pageContent: rawData, metadata: { source: "data.txt" } }),
  ]);

  const embeddings = new OpenAIEmbeddings({
    model: "text-embedding-3-small",
  });

  const vectorStore = await MemoryVectorStore.fromDocuments(docs, embeddings);
  const retriever = vectorStore.asRetriever(5);

  const question = "Who won the 2023 World Cup?";
  const results = await retriever.getRelevantDocuments(question);

  console.log("Retrieved Chunks:");
  results.forEach((doc: Document, idx: number) => {
    console.log(`Chunk ${idx + 1}:`, doc.pageContent.slice(0, 300));
  });

  const model = new ChatOpenAI({ temperature: 0, modelName: "gpt-4o-mini" });
  const context = results.map((d: Document) => d.pageContent).join("\n\n");

  const response = await model.call([
    { role: "system", content: "You are a helpful assistant." },
    {
      role: "user",
      content: `Answer the question based only on the context below.\n\nContext:\n${context}\n\nQuestion: ${question}`,
    },
  ]);

  console.log("Answer:", response.content);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});

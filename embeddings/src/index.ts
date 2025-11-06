import { OpenAI } from "openai";
import dotenv from "dotenv";
dotenv.config();
import { dirname, join } from "path";
import { fileURLToPath } from 'url'; // <-- New Import
import { readFileSync, writeFileSync } from "fs";


// --- ESM FIX: Define __dirname ---
// 1. Get the full path (URL) of the current file.
const __filename = fileURLToPath(import.meta.url);
// 2. Extract the directory name from the full path.
const __dirname = dirname(__filename);
// ---------------------------------

type Fruits = {
  id: string,
  name: string,
  description: string,
  embedding: number[]
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

function dotProduct(vecA: number[], vecB: number[]): number {
  // 1. Add a runtime check to ensure vectors are equal length
  if (vecA.length !== vecB.length) {
    // You can throw an error or return 0, depending on desired behavior
    throw new Error("Vectors must be of the same length for a dot product.");
  }

  // 2. TypeScript still can't guarantee vecB[index] is defined 
  //    because arrays are just lists, so we use a non-null assertion (!)
  return vecA.reduce((sum, value, index) => {
    // We can safely assert vecB[index] is defined because we checked the length above
    return sum + value * vecB[index]!;
    // ------------------------------^
  }, 0);
}


const cosineSimilarity = (vecA: number[], vecB: number[]) => {
  const dotProd = dotProduct(vecA, vecB);
  // Magnitude A: Dot product of vecA with ITSELF
  const magnitudeA = Math.sqrt(dotProduct(vecA, vecA));
  // Magnitude B: Dot product of vecB with ITSELF
  const magnitudeB = Math.sqrt(dotProduct(vecB, vecB));

  // Avoid division by zero if a magnitude is zero
  if (magnitudeA === 0 || magnitudeB === 0) {
    return 0; // Or throw an error, depending on your requirement
  }

  return dotProd / (magnitudeA * magnitudeB);
}

const similaritySearch = (fruits: Fruits[], target: Fruits) => {
  const similarities = fruits.filter(fruit => fruit.id !== target.id).map(fruit => ({
    name: fruit.name,
    dot: dotProduct(fruit.embedding!, target.embedding!),
    cosine: cosineSimilarity(fruit.embedding!, target.embedding!),
  })).sort((a, b) => b.cosine - a.cosine);
  return similarities
}
export function loadFruitJsonFile<T>(fileName: string): T {
  // This now uses the correctly defined __dirname
  const filePath = join(__dirname, fileName);
  const rawData = readFileSync(filePath, "utf-8");
  return JSON.parse(rawData.toString());
}

const saveDataToJsonFile = (fileName: string, data: any) => {
  const filePath = join(__dirname, fileName);
  const jsonData = JSON.stringify(data, null, 2);
  writeFileSync(filePath, jsonData, 'utf-8');
}
async function generateEmbeddings(fruitDescriptions: string[]) {
  const response = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: fruitDescriptions
  });
  return response;
}

async function run() {
  const fruits: Fruits[] = loadFruitJsonFile('fruits.json');
  const fruitDescriptions = fruits.map(fruit => fruit.description);
  const embeddings = await generateEmbeddings(fruitDescriptions);
  const fruitWithEmbeddings = fruits.map((fruit, index) => ({
    ...fruit, "embedding": embeddings?.data[index]?.embedding
  }));
  const fileName = "fruits_with_embedding.json";

  saveDataToJsonFile(fileName, fruitWithEmbeddings);

  const targetFruit = fruitWithEmbeddings.find(fruit => fruit.name === 'Orange');
  if (!targetFruit || !targetFruit.embedding) {
    console.log("Target fruit is not found or missing embedding.");
    return
  }

  // --- FIX: Filter the array to guarantee no 'undefined' embeddings ---
  // Use a Type Predicate to tell TypeScript the filtered array matches the 'Fruits' type.
  const fruitsReadyForSearch = fruitWithEmbeddings.filter(
    (fruit): fruit is Fruits => fruit.embedding !== undefined
  );

  const similarities = similaritySearch(fruitsReadyForSearch, targetFruit as Fruits);
  console.log(`Similar fruits to ${targetFruit.name}`);

  similarities.forEach(similarity => {
    console.log(`Name: ${similarity.name}, Dot Product: ${similarity.dot.toFixed(2)}, Cosine: ${similarity.cosine}`)
  })
  // ------------------------------------^
  console.log("Done.");
}

run();


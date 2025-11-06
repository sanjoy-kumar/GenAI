import fetch from "node-fetch";

export class HuggingFaceEmbedding {
  async generate(texts: string[]): Promise<number[][]> {
    const apiUrl = "https://api-inference.huggingface.co/models/sentence-transformers/all-MiniLM-L6-v2";
    const headers = {
      Authorization: `Bearer ${process.env.HF_API_KEY}`,
      "Content-Type": "application/json",
    };

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers,
        body: JSON.stringify({ inputs: texts }),
      });

      const data = await response.json();

      if (!Array.isArray(data) || !Array.isArray(data[0])) {
        console.error("❌ Unexpected response from Hugging Face:", data);
        return texts.map(() => new Array(384).fill(0)); // fallback
      }

      return data as number[][];
    } catch (err) {
      console.error("❌ Error calling Hugging Face:", err);
      return texts.map(() => new Array(384).fill(0));
    }
  }
}

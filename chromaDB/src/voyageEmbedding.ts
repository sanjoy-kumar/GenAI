// import fetch from "node-fetch";
// import dotenv from "dotenv";
// dotenv.config();

// export class VoyageEmbedding {
//   async generate(texts) {
//     const response = await fetch("https://api.voyageai.com/v1/embeddings", {
//       method: "POST",
//       headers: {
//         "Authorization": `Bearer ${process.env.VOYAGE_API_KEY}`,
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         model: "voyage-large-2-instruct",  // free & powerful
//         input: texts,
//       }),
//     });

//     const data = await response.json();
//     if (!data.data) throw new Error(JSON.stringify(data));
//     return data.data.map((d) => d.embedding);
//   }
// }

import fetch from "node-fetch";

export class VoyageEmbedding {
  async generate(texts: string[]): Promise<number[][]> {
    const apiUrl = "https://api.voyageai.com/v1/embeddings";
    const headers = {
      Authorization: `Bearer ${process.env.VOYAGE_API_KEY}`,
      "Content-Type": "application/json",
    };

    const response = await fetch(apiUrl, {
      method: "POST",
      headers,
      body: JSON.stringify({ model: "voyage-large-2", input: texts }),
    });
    const data = await response.json();
    return data.data.map((d: any) => d.embedding);
  }
}

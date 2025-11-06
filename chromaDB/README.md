# 🧠 ChromaDB + OpenAI + TypeScript Setup Guide

This project demonstrates how to set up a **ChromaDB** environment with **OpenAI API** and **TypeScript** support.  
Follow the steps below to get started.

---

## ⚙️ Step 1: Initialize the Node.js Project

Create a `package.json` file automatically:

```bash
npm init -y
```

## 📦 Step 2: Install Required Dependencies

Install **OpenAI** and **dotenv** for environment configuration:

```bash
npm install openai dotenv
```
Install TypeScript:

```bash
npm install typescript
```

## 🧩 Step 3: Create and Configure tsconfig.json

Generate a new TypeScript configuration file:


```bash
npx tsc --init
```

Then, edit your tsconfig.json and enable the following two lines:


```json
"rootDir": "./src",
"outDir": "./dist",
```


## 📝 Step 4: Update package.json

Remove the existing test script line:

```json
"test": "echo \"Error: no test specified\" && exit 1"
```

Then add the following line before the "scripts" section:

```json
"type": "module",
```

Finally, add a "dev" script so you can easily run your project in development mode.
Your scripts section should look like this:

```json
"scripts": {
  "dev": "node dist/index.js"
}
```

## 🐳 Step 5: Run Chroma Server in Docker

Visit https://www.trychroma.com/

You can run a Chroma server in a Docker container using your local Docker Desktop.

Run this command in your terminal:

```bash
docker run -v ./chroma-data:/data -p 8000:8000 chromadb/chroma
```

Example (Windows path):

```bash
D:\Portfolio Projects\GenAI\chromaDB>docker run -v ./chroma-data:/data -p 8000:8000 chromadb/chroma
```

## 🧠 Step 6: Install ChromaDB and Related Packages

Install ChromaDB:

```bash
npm install chromadb
```

Install Chroma OpenAI integration:

```bash
npm install @chroma-core/openai
```

Install TypeScript development dependencies:

```bash
npm install -D typescript ts-node @types/node
```

## 🧰 Step 7: Compile the TypeScript Files
Run the TypeScript compiler in watch mode:

```bash
npx tsc -w
```

## 🚀 Step 8: Run the Application

Start your project using:

```bash
npm run dev
```

## 🧾 Notes

  1. Make sure Docker Desktop is running before starting ChromaDB.
  2. Use Node.js v18+ for compatibility with ES modules.
  3. Create your .env file in the root directory to store API keys (e.g., OPENAI_API_KEY).

## 👨‍💻 Author

Sanjoy Kumar Das
Project: GenAI / ChromaDB Integration
License: MIT


⭐ If you find this project helpful, don’t forget to star it!

```yaml
Would you like me to add a short **example TypeScript snippet** (e.g., connecting to Chroma and adding/querying data) at the bottom of the README? It can help others understand how to start coding with the setup.
```
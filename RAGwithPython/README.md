# 📖 RAG Pipeline for PDF Document Ingestion and Retrieval

This repository contains a complete pipeline for **Retrieval-Augmented Generation (RAG)**, designed to ingest and process PDF documents, store their embeddings in a vector database, and perform context-aware question-answering using a Large Language Model (LLM).

The pipeline demonstrates essential RAG components, from data loading and chunking to advanced retrieval features like streaming and source citation.

# 🚀 Key Features

  * **PDF Data Ingestion:** Recursively loads and processes all PDF files from a specified directory.
  * **Document Chunking:** Uses *RecursiveCharacterTextSplitter* from LangChain to break documents into optimally sized chunks for embedding.
  * **Custom Embedding Manager:** Generates document embeddings using a Sentence Transformer model (*all-MiniLM-L6-v2*).
  * **Persistent Vector Store:** Utilizes ChromaDB to efficiently store and retrieve document embeddings.
  * **RAG Retriever Class:** Implements similarity search using the vector store.
  * **Simple & Advanced RAG Pipelines:** Includes basic RAG for question answering and an enhanced pipeline with **citations, confidence scoring, history, and summarization.**
  * **LLM Integration:** Connects with the **OpenAI** *gpt-4o-mini* model for final answer generation.

# ⚙️ Pipeline Steps

The RAG process is implemented across several logical steps in the provided notebook:

**1. Data Ingestion & Loading**
  * Uses PyPDFLoader to load text content from all PDFs in the ../data directory.
  * The process_all_pdfs function ensures metadata (like source_file and file_type) is attached to each document.

**2. Text Splitting & Chunking**
  * The split_documents function employs RecursiveCharacterTextSplitter to create text chunks with a chunk_size of 1000 and a chunk_overlap of 200. This overlap helps preserve context between chunks.

**3. Embeddings Generation**
  * The EmbeddingManager class wraps the Sentence Transformer model (all-MiniLM-L6-v2) to generate vector representations of the text chunks.

**4. Vector Store Creation**
  * The VectorStore class manages the ChromaDB instance, creating a persistent collection (*pdf_documents*) to store the text chunks, their metadata, and their corresponding embeddings.

**5. RAG Retriever Implementation**
  * The RAGRetriever class handles the core retrieval logic:
    1. Embeds the user's query.
    2. Queries the ChromaDB collection for the *top-k* most similar document embeddings.
    3. Calculates the similarity score (converting ChromaDB's cosine distance: 1 - *distance*).

**6. RAG Pipelines (Simple & Advanced)** 
  * **rag_simple:** Takes the retrieved context and a query, and passes them to the LLM for a concise answer.
  * **rag_advanced:** Enhances the response by returning the answer, a list of sources, and a confidence score based on the max retrieval score.  * **AdvancedRAGPipeline:** Introduces features like query history, adding citations to the final answer, and an optional answer summarization step.

# 🛠️ Requirements & Setup
## Prerequisites
  * Python 3.8+
  * An OpenAI API Key (for the final LLM step)

## Installation
Clone the repository and install the required Python packages:
```
git clone <repository-url>
cd <repository-name>
pip install -r requirements.txt
```
## Environment Variables
Create a file named *.env* in the root directory and add your OpenAI API key:

```
# .env
OPENAI_API_KEY="your-openai-api-key-here"
```

# 📂 Project Structure

```
.
├── pdf_loader.ipynb        # Main RAG pipeline notebook
├── data/                   # Directory for input PDFs
│   └── (pdf files go here)
└── data/vector_store/      # Persistent ChromaDB data
```

# 📝 Usage

The entire RAG pipeline is implemented and executed within the pdf_loader.ipynb Jupyter notebook. Follow the cells sequentially:

1. **Preparation:** Place your PDF documents inside the data directory.
2. **Execution:** Run the cells in the notebook to:
      * Load and chunk documents.
      * Initialize and load the embedding model.
      * Initialize and populate the ChromaDB vector store.
      * Test the *rag_retriever* and the simple/advanced RAG functions with custom queries.


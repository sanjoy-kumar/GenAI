from src.data_loader import load_all_documents
from src.vectorstore import FaissVectorStore
from src.search import RAGSearch
import os

# Example usage
if __name__ == "__main__":
    
    docs = load_all_documents("data")
    store = FaissVectorStore("faiss_store")
    #store.build_from_documents(docs)
    faiss_path = "faiss_store/faiss.index"

    if os.path.exists(faiss_path):
        store.load()
    else:
        print("[INFO] FAISS index not found. Creating new index...")
        store.build_from_documents(docs)  # ✅ correct method
    #print(store.query("What is attention mechanism?", top_k=3))
    rag_search = RAGSearch()
    query = "What is attention mechanism?"
    summary = rag_search.search_and_summarize(query, top_k=3)
    print("Summary:", summary)
    
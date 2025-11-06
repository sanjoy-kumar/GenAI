from PyPDF2 import PdfReader
from dotenv import load_dotenv
from flask import Flask, request, jsonify
from flask_cors import CORS
from langchain_community.vectorstores import FAISS
from langchain_community.embeddings import OpenAIEmbeddings
from langchain_community.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.chains import ConversationalRetrievalChain
from langchain_community.chat_models import ChatOpenAI
import tempfile
import os


load_dotenv()

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
if not OPENAI_API_KEY:
    raise RuntimeError("OPENAI_API_KEY not set in environment")

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), "uploads")
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Global store for vector DB and conversation memory (demo only)
vector_db = None

def extract_text_from_pdf(path):
    text = ""
    try:
        reader = PdfReader(path)
        for page in reader.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text + "\n"
    except Exception as e:
        print("PDF read error:", e)
    return text

@app.route("/api/upload", methods=["POST"])
def upload_pdf():
    """
    Upload PDF, extract text, chunk it, create embeddings and build FAISS index.
    Response: {"message": "...", "chunks": n}
    """
    global vector_db

    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["file"]
    if not file.filename.lower().endswith(".pdf"):
        return jsonify({"error": "Only PDF files supported"}), 400

    with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
        file.save(tmp.name)
        pdf_path = tmp.name

    text = extract_text_from_pdf(pdf_path)
    if not text.strip():
        return jsonify({"error": "No text extracted from PDF"}), 400

    # Split into chunks (adjust chunk_size/chunk_overlap as needed)
    splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=150)
    texts = splitter.split_text(text)

    # Create embeddings using OpenAI
    embeddings = OpenAIEmbeddings(openai_api_key=OPENAI_API_KEY)

    # Build FAISS index from chunks
    vector_db = FAISS.from_texts(texts, embeddings)

    # Save index to disk (optional)
    index_path = os.path.join(UPLOAD_FOLDER, "faiss_index")
    vector_db.save_local(index_path)

    return jsonify({"message": "PDF processed", "chunks": len(texts)})

@app.route("/api/summarize", methods=["GET"])
def summarize():
    """
    Summarize the entire uploaded document by running a retrieval+LLM summarization.
    """
    global vector_db
    if vector_db is None:
        return jsonify({"error": "No document uploaded"}), 400

    # Chat model (LangChain wrapper). You can change model, temperature, etc.
    llm = ChatOpenAI(model="gpt-3.5-turbo", temperature=0.2, openai_api_key=OPENAI_API_KEY)

    # Build ConversationalRetrievalChain (retriever = our FAISS index)
    retriever = vector_db.as_retriever(search_kwargs={"k": 6})
    qa_chain = ConversationalRetrievalChain.from_llm(llm, retriever=retriever, return_source_documents=False)

    # Ask the chain to summarize the whole document
    prompt = """
              Summarize the uploaded document clearly and concisely.
              Highlight key points, main ideas, and conclusions.
              If the document has multiple sections, summarize each section separately.
              Output format:
              1. Overview
              2. Key Points
              3. Summary by Sections (if applicable)
              4. Conclusion
             """

    result = qa_chain({"question": prompt, "chat_history": []})

    # result['answer'] contains the summary
    return jsonify({"summary": result.get("answer", "")})

@app.route("/api/query", methods=["POST"])
def query():
    """
    Accepts JSON: { "question": "..." } and returns LLM answer using retrieved context.
    """
    global vector_db
    if vector_db is None:
        return jsonify({"error": "No document uploaded"}), 400

    data = request.get_json() or {}
    question = data.get("question", "").strip()
    if not question:
        return jsonify({"error": "Question is required"}), 400

    llm = ChatOpenAI(model="gpt-3.5-turbo", temperature=0.2, openai_api_key=OPENAI_API_KEY)
    retriever = vector_db.as_retriever(search_kwargs={"k": 6})
    qa_chain = ConversationalRetrievalChain.from_llm(llm, retriever=retriever, return_source_documents=False)

    result = qa_chain({"question": question, "chat_history": []})
    return jsonify({"answer": result.get("answer", "")})


if __name__ == "__main__":
    port = int(os.getenv("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=True)

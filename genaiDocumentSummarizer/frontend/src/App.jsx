import React, { useState } from "react";
import FileUploader from "./components/FileUploader";
import QAWidget from "./components/QAWidget";

export default function App() {
  const [summary, setSummary] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:5000";

  const handleGenerateSummary = async () => {
    setIsProcessing(true);
    try {
      const res = await fetch(`${API_URL}/api/summarize`);
      const data = await res.json();
      if (res.ok) setSummary(data.summary);
      else alert(data.error || "Error generating summary");
    } catch (err) {
      console.error(err);
      alert("Network error");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="page">
      <header className="hero">
        <h1>📄 GenAI Document Summarizer</h1>
        <p className="subtitle">Upload PDFs, get smart summaries, and ask questions.</p>
      </header>

      <main className="container">
        <section className="panel">
          <FileUploader />
          <div className="controls">
            <button className="btn primary" onClick={handleGenerateSummary} disabled={isProcessing}>
              {isProcessing ? "Generating..." : "Generate Summary"}
            </button>
          </div>
        </section>

        <section className="panel">
          <h2>🧠 Summary</h2>
          <div className="summary-box">
            <label className="file-label">
              {summary ? <pre className="summary-text">{summary}</pre> : <p className="muted">No summary yet.</p>}
            </label>
          </div>
        </section>

        <section className="panel">
          <h2>❓ Ask about the document</h2>
          <QAWidget />
        </section>
      </main>

      <footer className="footer">Built with ❤️ • Flask + LangChain + FAISS + React</footer>
    </div>
  );
}

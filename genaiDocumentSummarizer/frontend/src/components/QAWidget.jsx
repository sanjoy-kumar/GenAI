import React, { useState } from "react";
import ReactMarkdown from "react-markdown";

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:5000";

export default function QAWidget() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const ask = async () => {
    if (!question.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/query`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });
      const data = await res.json();
      if (res.ok) setAnswer(data.answer);
      else setAnswer(data.error || "Error from server");
    } catch (err) {
      console.error(err);
      setAnswer("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="qa-widget">
      <textarea
        placeholder="Ask something about the uploaded document..."
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
      />
      <div className="qa-actions">
        <button className="btn" onClick={ask} disabled={loading}>{loading ? "Thinking..." : "Ask"}</button>
      </div>

      <div className="answer">
        {answer ? <ReactMarkdown>{answer}</ReactMarkdown> : <p className="muted">Answers will appear here.</p>}
      </div>
    </div>
  );
}

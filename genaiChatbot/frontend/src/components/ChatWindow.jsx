import React, { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { motion } from "framer-motion";
import "./../styles/ChatWindow.css";

function ChatWindow() {
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem("chatHistory");
    return saved ? JSON.parse(saved) : [];
  });
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef(null);

  // Auto-scroll when new message
  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  // Save messages in localStorage
  useEffect(() => {
    localStorage.setItem("chatHistory", JSON.stringify(messages));
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = { role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:5000";
      const res = await fetch(`${API_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });
      const data = await res.json();
      const replyMsg = {
        role: "assistant",
        content: data.reply || "⚠️ Something went wrong.",
      };
      setMessages((prev) => [...prev, replyMsg]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleReset = () => {
    setMessages([]);
    localStorage.removeItem("chatHistory");
  };

  return (
    <div className="chat-container">
      <header className="chat-header">
        <h2>💬 Gen AI Chatbot</h2>
        <button onClick={handleReset}>Reset</button>
      </header>

      <div className="chat-box">
        {messages.map((msg, i) => (
          <motion.div
            key={i}
            className={`message ${msg.role}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="bubble">
              <ReactMarkdown>{msg.content}</ReactMarkdown>
            </div>
          </motion.div>
        ))}

        {isLoading && (
          <div className="message assistant">
            <div className="bubble typing">
              <span></span><span></span><span></span>
            </div>
          </div>
        )}

        <div ref={chatEndRef}></div>
      </div>

      <div className="input-box">
        <textarea
          rows="1"
          placeholder="Type a message and press Enter..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button onClick={handleSend} disabled={isLoading}>
          {isLoading ? "..." : "Send"}
        </button>
      </div>
    </div>
  );
}

export default ChatWindow;
